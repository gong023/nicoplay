require "#{Dir::pwd}/class/nicosecret.rb"
require "#{SCRIPT_ROOT}/class/nicobase.rb"

class NicoRankingWWW < NicoBase
  include NicoQuery
  def getRankingByinterval(from_date, to_date)
    mysql = NicoBase.new.initMysql
    select = find_by_interval('daily_music', from_date.to_s, to_date.to_s)
    mysql.query(select)
  end
end
