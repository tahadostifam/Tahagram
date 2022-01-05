class JsonBodyParser
    def initialize(app)
      @app = app
    end

    def call(env)
        begin
            result = JSON.parse(Rack::Request.new(env).body.read)
            puts result
            if result.length > 0
                @app.call(env)
            end
        rescue => exception
            Rack::Response.new(['Content-Type of your request header should be application/json!'], 503, {}).finish
        end
    end
end