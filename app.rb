open('/etc/my/sinatra/nicoplay/env.txt').each do |env|
  if env.gsub(/\n/, "") == 'sakura'
    require File.expand_path(File.dirname(__FILE__)) + '/app/sakura/app.rb'
  elsif env.gsub(/\n/, "") == 'ec2'
    require File.expand_path(File.dirname(__FILE__)) + '/app/ec2/app.rb'
  end
end
