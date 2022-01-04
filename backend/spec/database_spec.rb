require_relative '../src/store.rb'

RSpec.describe "Database" do
    context "Deleting Users After Signup Failed" do
        it "Set : " + gimme_redis().set('test', 'asdadad')
        it "Name : " + gimme_redis().get('name')
    end
end