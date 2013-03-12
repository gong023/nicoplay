# -*- encoding: utf-8 -*-
require 'sinatra/base'
require 'haml'
require "#{Dir::pwd}/class/nicoranking_www.rb"
require 'json'

class Nicoplay < Sinatra::Base
  set :haml, :format => :html5

  get '/' do
    @from_date = (Date::today - 30).to_s
    @to_date = Date::today.to_s
    @ranking = NicoRankingWWW.new.getByInterval(@from_date, Time.now)
    haml :rank
  end

  get '/keyword' do
    keyword = params[:w]
    @ranking = NicoRankingWWW.new.getByKeyword(keyword)
    @to_date = @ranking[0]['ctime']
    @from_date = @ranking[@ranking.length-1]['ctime']
    haml :rank
  end

  get '/rand' do
    limit = params[:l].nil? ? 30 : params[:l]
    @ranking = NicoRankingWWW.new.getByRand(limit)
    @to_date = @ranking[0]['ctime']
    @from_date = @ranking[@ranking.length-1]['ctime']
    haml :rank
  end

end
