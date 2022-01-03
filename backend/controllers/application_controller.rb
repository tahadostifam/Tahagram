class ApplicationController < Sinatra::Base
    configure :production, :development do
      enable :logging
    end

    get '/' do
      "Hello Ruby ^^"
    end
end  