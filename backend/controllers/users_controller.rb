require 'json'
require 'bcrypt'
require_relative '../lib/validate_params.rb'
require_relative '../src/database.rb'
require_relative '../src/store.rb'

$db = Database.new

class UsersController < ApplicationController    
  post '/signup' do
    signup_params_state = validate_signup_params!
    if signup_params_state.class != NilClass
      return response_json({errors: signup_params_state, message: "required parameters are empty"}, 400)
    end

    response_json({message: ":)"}, 200)

    # $db.exec_query!("INSERT into tbl_users(full_name, username, password_digest) VALUES($1, $2, $3)", []) do |state|
    #   if state
    #     201
    #     response_json({message: "user created successfully"})
    #   end
    # end
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
    return errors_total.without_nil
  end
end