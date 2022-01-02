require "sinatra/base"
require_relative "../lib/configs_parser.rb"

class App < Sinatra::Base
  set :public_folder, '../public'
  set :bind, '0.0.0.0'
  set :port, configs["api"]["port"]

  get '/' do
    "Hello from MyApp!"
  end

  run!
end