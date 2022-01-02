require "sinatra/base"
require_relative "../lib/configs_parser.rb"

class App < Sinatra::Base
  set :public_folder, '../public'
  set :bind, '0.0.0.0'
  set :port, configs["api"]["port"]

  get '/' do
    "<h1>Hello!</h1>"
  end

  run!
end