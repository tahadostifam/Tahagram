require './src/database_handler.rb'
require './src/api_handler.rb'
require_relative "../lib/configs_parser.rb"

db = Database.new.gimme_db()

# Thread.new {
#     App.run!
# }

# sleep