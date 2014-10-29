require 'rubygems'
require 'sinatra'

set :public_folder, 'www'

get '/' do
  File.read(File.join('www', 'index.html'))
end
