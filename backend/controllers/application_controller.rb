require 'sinatra/cross_origin'

class ApplicationController < Sinatra::Base
    register Sinatra::CrossOrigin

    set :allow_origin, :any
    set :allow_methods, [:get, :post, :options]
    set :expose_headers, ['Content-Type']

    def response_json(object, status_code)
      content_type :json
      status status_code
      object.to_json 
    end

    before do
      begin
        @body = JSON.parse(Rack::Request.new(env).body.read)
      rescue => err
        response_json({message: 'Content-Type of your request header should be application/json!'}, 503)
      end
    end

    configure do
      enable :cross_origin
    end

    options "*" do
      response.headers["Allow"] = "GET, POST, OPTIONS"
      response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept"
      200
    end

    not_found do
        response_json({message: "not found error"}, 404)
    end

    # Http Status Codes

    def server_error
        response_json({message: "An error occurred while creating the user"}, 500)
    end

    def user_created_successfully(refresh_token, auth_token)
        response_json(
          {
            message: "User created successfully",
            tokens: {
              refresh_token: refresh_token.to_s,
              auth_token: auth_token.to_s
            }
          },
          201
        )
    end

    def we_need_required_params(errors)
      response_json({errors: errors, message: "required parameters are empty"}, 400)
    end

    def unauthorized
      response_json({message: "Unauthorized"}, 401)
    end

    def username_or_password_is_incorrect
      response_json({message: "Username or password is incorrect"}, 401)
    end
end  