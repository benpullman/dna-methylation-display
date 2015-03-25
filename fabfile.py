from fabric.api import *

env.hosts = ['root@104.131.17.217']

def packApp():
	local('brunch build --production')

def uploadApp():
    put('public/index.html','/var/www/display')
    put('public/js','/var/www/display')
    put('public/css','/var/www/display')
    put('public/partials','/var/www/display')
    put('public/img','/var/www/display')

def uploadData():
    put('public/data.json','/var/www/display')

def uploadAll():
    uploadApp()
    uploadData()

def deployApp():
    packApp()
    uploadAll()