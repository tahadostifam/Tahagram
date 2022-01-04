require 'json'
require 'bcrypt'
require_relative '../lib/validate_params.rb'
require_relative '../src/database.rb'
require_relative '../src/store.rb'

$db = Database.new

class UsersController < ApplicationController    
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
          set_and_gimme_token(params["username"], request.ip, "refresh_t") do |refresh_token_callbackfn|
            if refresh_token_callbackfn == nil
              delete_user params["username"]

              server_error
            else
              set_and_gimme_token(params["username"], request.ip, "auth_t") do |auth_token_callbackfn|
                if auth_token_callbackfn == nil
                  delete_user params["username"]
    
                  server_error
                else
                  user_created_successfully(refresh_token_callbackfn, auth_token_callbackfn)
                end
              end
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

  private

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
end