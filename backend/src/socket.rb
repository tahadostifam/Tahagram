require 'websocket-eventmachine-server'
require_relative "../lib/configs_parser.rb"

class SocketServer
  def initialize
    EM.run do
      WebSocket::EventMachine::Server.start(:host => "0.0.0.0", :port => configs["socket"]["port"]) do |ws|
        ws.onopen do
          puts "Client connected"
        end
    
        ws.onmessage do |msg, type|
          puts "Received message: #{msg}"
          ws.send msg, :type => type
        end
    
        ws.onclose do
          puts "Client disconnected"
        end
      end
    end  
  end
end