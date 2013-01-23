require 'rubygems' unless defined? ::Gem
require File.dirname( __FILE__ ) + '/app'

run Sinatra::Application
