class Authenticator
    def initialize(app)
      @app = app
    end
  
    def call(env)
      puts "Hello World"
      @app.call(env)
    end
end