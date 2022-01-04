require 'json'
require 'bcrypt'
require_relative '../lib/validate_params.rb'
require_relative '../src/database.rb'
require_relative '../src/store.rb'
require_relative '../middlewares/authenticator.rb'

$db = Database.new

class UsersController < ApplicationController
  use Authenticator

  post '/signup' do
    signup_params_state = validate_signup_params!
    if signup_params_state != nil
      return response_json({errors: signup_params_state, message: "required parameters are empty"}, 400)
    end

    hashed_password = BCrypt::Password.create(params["password"])

    if validate_username_uniqueness?(params["username"])
      $db.exec_query!("INSERT into tbl_users(full_name, username, password_digest) VALUES($1, $2, $3)", [
        params[:full_name], params[:username], hashed_password
      ]) do |state, result|
        if state
          set_user_tokens(params["username"], request.ip) do |state, refresh_token, auth_token|
            if state != false
              user_created_successfully(refresh_token, auth_token)
            else
              server_error
            end
          end
        else
          server_error
        end
      end
    else
      response_json({message: "Username already registered"}, 409)
    end
  end

  post '/authentication' do
    auth_params_state = validate_authentication_params!
    if auth_params_state != nil
      return response_json({errors: auth_params_state, message: "required parameters are empty"}, 400)
    end

    get_user_with_auth_token(make_user_id(params["username"], request.ip, 'auth_t'), params["username"], params["auth_token"]) do |callback|
      if callback != false
        response_json({
          data: callback
        }, 200)
      else
        unauthorized
      end
    end
  end

  post '/refresh_token' do
    refresh_token_params_state = validate_refresh_token_params!
    if refresh_token_params_state != nil
      return response_json({errors: refresh_token_params_state, message: "required parameters are empty"}, 400)
    end

    get_user_with_auth_token(make_user_id(params["username"], request.ip, 'refresh_t'), params["username"], params["refresh_token"]) do |callback|
      if callback != false
        set_and_gimme_token(params["username"], request.ip, "auth_t") do |callback|
          if callback == nil
            server_error
          else
            response_json(
              {
                message: "auth_token changed successfully",
                auth_token: callback
              },
              200
            )
          end
        end
      else
        unauthorized
      end
    end
  end

  post '/signin' do
    signin_params_state = validate_signin_params!
    if signin_params_state != nil
      return response_json({errors: signin_params_state, message: "required parameters are empty"}, 400)
    end

    $db.select("SELECT * from tbl_users WHERE username=$1", [params["username"]]) do |result|
      unless result.empty?
        # success
        hashed_password = BCrypt::Password.new(result[0]["password_digest"])
        if hashed_password == params["password"]
          set_user_tokens(params["username"], request.ip) do |state, refresh_token, auth_token|
            if state != false
              # removing password of data that will be send to user
              # we do it for be still in security
              response_json(
                {
                  message: "Success",
                  tokens: {
                    refresh_token: refresh_token.to_s,
                    auth_token: auth_token.to_s
                  },
                  data: {
                    full_name: result[0]["full_name"],
                    username: result[0]["username"],
                    bio: result[0]["bio"],
                    last_seen: result[0]["last_seen"],
                  }
                },
                200
              )
            else
              server_error
            end
          end
        else
          username_or_password_is_incorrect  
        end
      else
        # not a valid password
        username_or_password_is_incorrect
      end
    end
  end

  private

  def set_user_tokens(username, client_ip, &block)
    set_and_gimme_token(username, client_ip, "refresh_t") do |refresh_token_callbackfn|
      if refresh_token_callbackfn == nil
        # error
        delete_user username
        return yield(false, nil, nil)
      else
        set_and_gimme_token(username, client_ip, "auth_t") do |auth_token_callbackfn|
          if auth_token_callbackfn == nil
            # error
            delete_user username
            return yield(false, nil, nil)
          else
            # success
            return yield(true, refresh_token_callbackfn, auth_token_callbackfn)
          end
        end
      end
    end
  end

  def delete_user(username)
    $db.database().send_query("DELETE FROM tbl_users WHERE username=$1", [username])
  end

  def validate_username_uniqueness?(username)
    $db.select("SELECT username from tbl_users WHERE username=$1", [username]) do |result|
      if result.length == 0
        return true
      else
        return false
      end
    end
  end

  def validate_signup_params!
    errors_total = []
    presence_validating = validate_params(
      ["Fullname", "Username", "Password"],
      [ params[:full_name], params[:username], params[:password] ]
    )
    errors_total << presence_validating
    if presence_validating == nil
      errors_total << max_length("Username", params[:username], 10)
      errors_total << min_length("Username", params[:username], 3)
    end
    if errors_total.without_nil.length == 0
      return nil
    else
      return errors_total.without_nil
    end
  end

  def validate_signin_params!
    errors_total = []
    presence_validating = validate_params(
      ["Username", "Password"],
      [ params[:username], params[:password] ]
    )
    errors_total << presence_validating
    if errors_total.without_nil.length == 0
      return nil
    else
      return errors_total.without_nil
    end
  end

  def validate_authentication_params!
    errors_total = []
    presence_validating = validate_params(
      ["Username", "AuthToken"],
      [ params[:username], params[:auth_token] ]
    )
    errors_total << presence_validating
    if errors_total.without_nil.length == 0
      return nil
    else
      return errors_total.without_nil
    end
  end

  def validate_refresh_token_params!
    errors_total = []
    presence_validating = validate_params(
      ["Username", "RefreshToken"],
      [ params[:username], params[:refresh_token] ]
    )
    errors_total << presence_validating
    if errors_total.without_nil.length == 0
      return nil
    else
      return errors_total.without_nil
    end
  end
end