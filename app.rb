File::open('/etc/my/sinatra/nicoplay/env.txt').each do |env|
  env.chomp!
  if env == 'sakura'
    require File.expand_path(File.dirname(__FILE__)) + '/app/sakura/app.rb'
  elsif env == 'ec2'
    require File.expand_path(File.dirname(__FILE__)) + '/app/ec2/app.rb'
  end
end
