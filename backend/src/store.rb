require 'redis'
require_relative "../lib/configs_parser.rb"

$redis = Redis.new(
    :host => configs["redis"]["host"],
    :port => configs["redis"]["port"],
    :username => configs["redis"]["user"],
    :password => configs["redis"]["pass"],
    :reconnect_attempts => 9999,
    :reconnect_delay => 0.5,
    :reconnect_delay_max => 500.0,
)