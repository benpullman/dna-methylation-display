exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
    	joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components|vendor)/
      order:
        before:
          [
           'bower_components/jquery/dist/jquery.js',
           'vendor/javascripts/bootstrap.js',
           'vendor/javascripts/bootstrap/tooltip.js'
          ]

    stylesheets:
      joinTo: 'css/app.css'
      order:
        before:
          ['app/styles/fonts.scss']
        after:
          ['app/styles/style.scss']

  	plugins:
    	sass:
      	mode: 'ruby'