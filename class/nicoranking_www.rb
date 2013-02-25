require_relative "nicosecret.rb"
require "#{SCRIPT_ROOT}/app/nicobase.rb"

class NicoRankingWWW < NicoBase
  include NicoQuery
  def getRankingByinterval(from_date, to_date)
    mysql = NicoBase.new.initMysql
    select = find_enable_by_interval(from_date.to_s, to_date.to_s)
    mysql.query(select).to_a.reverse
  end

  def getRankingByKeyword(keyword)
    mysql = NicoBase.new.initMysql
    select = find_enable_by_keyword(keyword)
    mysql.query(select).to_a.reverse
  end
end
