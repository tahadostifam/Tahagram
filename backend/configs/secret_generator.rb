require 'json'
require 'securerandom'

token = SecureRandom.hex(35)

new_file_content = {
    "refresh_token": token
}

File.open('./secrets.json', 'w') do |f|
    f.write(new_file_content.to_json.to_s)
    puts "Secret key changed! -> #{token[1..10]}..."
    exit
end