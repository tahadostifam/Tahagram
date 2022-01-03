class ApplicationController < Sinatra::Base
    def response_json(object, status_code)
        content_type :json
        status status_code
        object.to_json 
    end

    not_found do
        response_json({message: "not found error"}, 404)
    end
end  