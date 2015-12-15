from fabric.api import *

env.hosts = ['ben@hitmap.stuartscottlab.org']

def packApp():
	local('brunch build --production')

def uploadApp():
    put('public/index.html','/var/www/public/alpha')
    put('public/js','/var/www/public/alpha')
    put('public/css','/var/www/public/alpha')
    put('public/partials','/var/www/public/alpha')
    put('public/img','/var/www/public/alpha')
    put('public/index.html','/var/www/public')
    put('public/js','/var/www/public')
    put('public/css','/var/www/public')
    put('public/partials','/var/www/public')
    put('public/img','/var/www/public')

def deployApp():
    packApp()
    uploadApp()
