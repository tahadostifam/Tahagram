require 'json'
require_relative '../lib/validate_params.rb'
require_relative '../src/database.rb'
require_relative '../src/store.rb'

$db = Database.new

class UsersController < ApplicationController    
  post '/signup' do
    signup_params = validate_signup_params!
    response_json({errors: signup_params, message: "required parameters are empty"}, 400)

    # $db.exec_query!("INSERT into tbl_users(full_name, username, password_digest) VALUES($1, $2, $3)", []) do |state|
    #   if state
    #     201
    #     response_json({message: "user created successfully"})
    #   end
    # end
  end

  private

  def validate_signup_params!
    return validate_params(
      ["Fullname", "Username", "Password"],
      [ params[:full_name], params[:username], params[:password] ]
    )
  end
end