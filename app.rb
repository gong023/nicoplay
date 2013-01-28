require 'sinatra/base'
require 'sinatra/reloader'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"
require 'json'

class App < Sinatra::Base
  register Sinatra::Reloader
  set :server, "webrick"
  set :haml, :format => :html5
  #set :port, 80

  get '/nicoplay/' do
    # 裏で走るscriptと整合性をとる
    # AM0:00 ~ 4:00は次の日の分とらない
    @to_date = Time.now.strftime("%H") <= '04' ? Date::today - 1 : Date::today
    @from_date = @to_date - 10
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(@from_date, @to_date).to_a.reverse.each_with_index do |ret, i|
      #TODO:保存ディレクトリが一日遅れるバグ？暫定対処
      parsed = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      ret['ctime'] = (Date.strptime(parsed, '%Y-%m-%d') + 1).to_s
      @ranking.store(i, ret)
    end
    haml :rank
  end
end

App::run!
