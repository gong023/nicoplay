# -*- encoding: utf-8 -*-
require 'sinatra/base'
require 'sinatra/reloader'
require 'haml'
require "/var/www/html/nicoplay/class/nicoranking_www.rb"
require 'json'

class Nicoplay < Sinatra::Base
  register Sinatra::Reloader
  set :server, 'webrick'
  set :haml, :format => :html5
  #set :port, 80

  get '/nicoplay/' do
    @to_date = Date::today
    @from_date = Date::today - 30
    @ranking = {}
    NicoRankingWWW.new.getRankingByinterval(@from_date, Time.now).each_with_index do |ret, i|
      ret['ctime'] = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      @ranking.store(i, ret)
    end
    haml :rank
  end

  get '/nicoplay/keyword' do
    keyword = params[:w]
    @ranking = {}
    NicoRankingWWW.new.getRankingByKeyword(keyword).each_with_index do |ret, i|
      ret['ctime'] = ret['ctime'].to_s.sub(/\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/,  '')
      @ranking.store(i, ret)
    end
    @to_date = @ranking[0]['ctime']
    @from_date = @ranking[@ranking.length-1]['ctime']
    haml :rank
  end

end
