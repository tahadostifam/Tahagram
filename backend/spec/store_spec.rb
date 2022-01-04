require_relative '../src/store.rb'

$redis = gimme_redis()

state = $redis.get("maximilian_auth_t_127001")

if state == nil
    puts "no"
else
    puts "yes"
end

puts '----------'

puts $redis.keys('*')