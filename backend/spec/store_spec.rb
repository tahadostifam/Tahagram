require_relative '../src/store.rb'

$redis = gimme_redis()

state = $redis.get("maximilian_auth_t_127001")

puts state 

puts '----------'

puts $redis.keys('*')