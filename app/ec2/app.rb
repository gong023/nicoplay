require 'sinatra/base'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"
require 'json'

class Nicoplay < Sinatra::Base
  set :haml, :format => :html5

  get '/' do
    # 裏で走るscriptと整合性をとる
    # AM0:00 ~ 4:00は次の日の分とらない
    @to_date = Time.now.strftime("%H") <= '04' ? Date::today - 1 : Date::today
    @from_date = @to_date - 30
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(@from_date, @to_date).each_with_index do |ret, i|
      ret['ctime'] = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      @ranking.store(i, ret)
    end
    haml :rank
  end
end
