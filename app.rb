require 'sinatra/base'
require 'sinatra/reloader'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"

class App < Sinatra::Base
  register Sinatra::Reloader
  set :server, "webrick"

  get '/nicoplay/' do
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(nil, nil).each do |ret|
      @ranking.store(ret['video_id'], ret['title'])
    end
    haml :rank
  end
end

App.run!
