require 'sinatra/base'
require_relative './src/database.rb'
require_relative './src/socket.rb'
require_relative './src/store.rb'
require_relative "./lib/configs_parser.rb"

Dir.glob('./{controllers}/*.rb').each { |file| require file }

Thread.new {
    Database.new
    SocketServer.new
}

# Running Controllers!
map('/users') { run UsersController }
map('/') { run ApplicationController }