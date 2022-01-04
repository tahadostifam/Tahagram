require_relative '../src/database.rb'

$db = Database.new

RSpec.describe "Store" do
    context "Getting User Tokens" do
        $db.database().send_query("DELETE FROM tbl_users WHERE username=$1", ["maximilian"])
        $db.select("SELECT full_name, username from tbl_users", []) do |state, result|
            it result
        end
    end
end