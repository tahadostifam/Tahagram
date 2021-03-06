require 'json'
require 'securerandom'

token = SecureRandom.hex(35)

new_file_content = {
    "SESSION_SECRET": token
}

File.open('./secrets.json', 'w') do |f|
    f.write(new_file_content.to_json.to_s)
    puts "Secret key changed! -> ...#{token[15..20]}..."
    exit
end