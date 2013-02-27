require_relative "nicosecret.rb"
require "#{SCRIPT_ROOT}/app/nicobase.rb"

class NicoRankingWWW < NicoBase
  include NicoQuery
  def getByInterval(from_date, to_date)
    getList find_enable_by_interval(from_date, to_date)
  end

  def getByKeyword(keyword)
    getList find_enable_by_keyword(keyword)
  end

  def getByRand(limit)
    getList find_enable_rand(limit)
  end

  def getList select
    list = NicoBase.new.initMysql.query(select).to_a.reverse
    pattern = /\ [0-9]+\:[0-9]+\:[0-9]+ \+[0-9]+$/
    list.map do |l|
      {
        'video_id' => l['video_id'],
        'title'    => l['title'],
        'ctime'    => l['ctime'].to_s.sub(pattern, '')
      }
    end
  end

end
