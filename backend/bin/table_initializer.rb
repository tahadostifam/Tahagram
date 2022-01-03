require 'colorize'
require './src/database.rb'

$db = Database.new

def success(table_name)
   puts "#{table_name} initialized successfully! :)".green
end

def error(table_name)
   puts "#{table_name}.sql not exist at database/ directory.".red
end

def table_exists(table_name)
    puts "#{table_name} exists.".yellow
end

def init_table(table_name)
    file_path = Dir.getwd + "/database/#{table_name}.sql"
    if File.exist?(file_path)
        File.open(file_path, "r") do |f|
            table_query_string = f.read.strip
            if $db.table_exist?(table_name)
                table_exists table_name
            else
                $db.database().send_query(table_query_string)
                success(table_name)
            end
        end
    else
        error(table_name)
    end
end