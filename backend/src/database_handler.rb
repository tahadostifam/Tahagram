require 'mongo'

class MongoDB
    @client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'chatapp_db')
    @db = @client.database
    def gimme_db()
        unless @db == nil
            return @db
        else
            raise "Can't connect to MongoDB"
        end
    end
end