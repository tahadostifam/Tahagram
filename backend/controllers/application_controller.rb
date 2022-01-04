class ApplicationController < Sinatra::Base
    def response_json(object, status_code)
        content_type :json
        status status_code
        object.to_json 
    end

    not_found do
        response_json({message: "not found error"}, 404)
    end

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
    
end  