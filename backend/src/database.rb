require 'pg'
require_relative "../lib/configs_parser.rb"
  
class Database
    def connect
        $conn = PG.connect(
            configs["postgres"]["ip"],
            configs["postgres"]["port"],
            nil,
            nil,
            configs["postgres"]["db"],
            configs["postgres"]["user"],
            configs["postgres"]["pass"]
        )
    end
    
    def gimme_db()
        return $conn
    end

    def exec_query!(query_string, params, &block)
        begin
            $conn.exec(query_string, params) do |result|
                yield(true, result)
            end
        rescue PG::Error => err
            yield(false, result)
        end
    end

    def select(query_string, params, &block)
        begin
            $conn.exec(query_string, params) do |result|
                yield result.to_a
            end
        rescue PG::Error => err
            yield nil
        end
    end

    def table_exist?(table_name)
        self.exec_query!("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME=$1", [table_name]) do |s, result|
            if result.to_a.length == 0
                return false
            else
                return true
            end
        end 
    end
end