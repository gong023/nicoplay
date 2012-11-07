require 'sinatra/base'
require 'sinatra/reloader'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"
require 'json'

class App < Sinatra::Base
  register Sinatra::Reloader
  set :server, "webrick"
  set :haml, :format => :html5

  get '/nicoplay/' do
    @to_date   = Date::today
    @from_date = @to_date - 7
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(@from_date, @to_date).each_with_index do |ret, i|
      #TODO:保存ディレクトリが一日遅れるバグ？暫定対処
      parsed = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      ret['ctime'] = (Date.strptime(parsed, '%Y-%m-%d') + 1).to_s
      @ranking.store(i, ret)
    end
    haml :rank
  end
end

App.run!
