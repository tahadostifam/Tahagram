require 'redis'
require 'securerandom'
require_relative "../lib/configs_parser.rb"
require_relative "../lib/clear_ip.rb"

$refresh_token_length = configs["api"]["tokens"]["length"]["refresh_token"].to_i
$auth_token_length = configs["api"]["tokens"]["length"]["auth_token"].to_i

$refresh_token_expire = configs["api"]["tokens"]["expire"]["refresh_token"].to_i
$auth_token_expire = configs["api"]["tokens"]["expire"]["auth_token"].to_i

$redis = Redis.new(
    :host => configs["redis"]["host"],
    :port => configs["redis"]["port"],
    :username => configs["redis"]["user"],
    :password => configs["redis"]["pass"],
    :reconnect_attempts => 9999,
    :reconnect_delay => 0.5,
    :reconnect_delay_max => 500.0,
)

def make_user_id(username, client_ip, token_type)
    return "#{username}_#{token_type}_#{client_ip.clear_ip}"
end

def check_token_type_that_be_valid(token_type)
    unless ["auth_t", "refresh_t"].include?(token_type)
        raise "store.rb : Invalid token type at setting_refresh_token"
    end
end

def gimme_redis
    return $redis
end

def set_and_gimme_token(username, client_ip, token_type, &block)
    $redis.set("name", "maximilian")

    check_token_type_that_be_valid(token_type)
    if client_ip.length == 0
        return yield nil
    end
    user_id_in_store = make_user_id(username, client_ip, token_type)

    if token_type == "refresh_t"
        token = SecureRandom.hex($refresh_token_length)
        if $redis.set(user_id_in_store, token) == 'OK'
           if $redis.expire(user_id_in_store, $refresh_token_expire)
                return yield token
           else
                return yield nil
           end 
        else
            return yield nil
        end
    elsif token_type == "auth_t"
        token = SecureRandom.hex($auth_token_length)
        if $redis.set(user_id_in_store, token) == 'OK'
           if $redis.expire(user_id_in_store, $auth_token_expire)
                return yield token
           else
                return yield nil
           end 
        else
            return yield nil
        end
    end
    
    return yield nil
end

 def valid_token?(user_id_in_store)
    state = $redis.get("maximilian_auth_t_127001")
    if state == nil
        return false
    else
        return state
    end
end