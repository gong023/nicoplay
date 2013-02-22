require 'sinatra/base'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"
require 'json'

class Nicoplay < Sinatra::Base
  set :haml, :format => :html5

  get '/' do
    @to_date = Date::today
    @from_date = Date::today - 30
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(@from_date, Time.now).each_with_index do |ret, i|
      ret['ctime'] = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      @ranking.store(i, ret)
    end
    haml :rank
  end
end
