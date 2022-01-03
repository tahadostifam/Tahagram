require 'json'
require 'bcrypt'
require_relative '../lib/validate_params.rb'
require_relative '../src/database.rb'
require_relative '../src/store.rb'

$db = Database.new

class UsersController < ApplicationController    
  post '/signup' do
    signup_params_state = validate_signup_params!
    
    puts signup_params_state
    puts signup_params_state.class

    if signup_params_state != nil
      return response_json({errors: signup_params_state, message: "required parameters are empty"}, 400)
    end

    hashed_password = BCrypt::Password.create(params["password"])
    puts hashed_password

    $db.exec_query!("INSERT into tbl_users(full_name, username, password_digest) VALUES($1, $2, $3)", [
      params[:full_name], params[:username], hashed_password
    ]) do |state, result|
      puts state
      puts result
      if state
        response_json({message: "user created successfully"}, 201)
      else
        response_json({message: "an error occurred while creating the user"}, 500)
      end
    end
  end

  private

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