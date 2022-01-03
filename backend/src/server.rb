require './src/database_handler.rb'
require './src/api_handler.rb'

Database.new.connect

# Thread.new {
#     App.run!
# }

# sleep