require 'pg'
require_relative "../lib/configs_parser.rb"


class Database
    def gimme_db()
        return $db
    end
end