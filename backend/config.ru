require 'sinatra/base'
require_relative './src/database.rb'
require_relative './src/socket.rb'

Dir.glob('./{controllers}/*.rb').each { |file| require file }


Thread.new {
    Database.new.connect
    SocketServer.new
}

# Running Controllers!
map('/users') { run UsersController }
map('/') { run ApplicationController }