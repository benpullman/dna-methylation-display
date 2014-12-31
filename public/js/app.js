(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("controllers/controllers", function(exports, require, module) {
//'use strict';
/* Controllers */

angular.module('app.controllers', [])
  .controller('MainController', ['$scope','$routeParams','Resource',function($scope,$routeParams,Resource) {
    $scope.showAll = true;
    $scope.regions = {};
    $scope.allSamples = {};
    //$scope.regions = Resource.get({id: $routeParams['id']})
    Resource.get({}, function(data){
      var one = "";
      for(key in data.regions){
        one = key;
        break;
      }
      var allKeys = []
      for(sample in data.regions[one].samples){
        allKeys.push(sample)
      }
      $scope.allSamples = allKeys;
      $scope.regions = data;
    });
    $scope.getMethylationLevel = function(data){
        if (typeof data === "undefined"){
            return 0;
        } else if (data.length > 0){
        $scope.excluded = 0
        $scope.included = 0
        for(i=0;i<data.length;i++){
          data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
          data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
          if (data[i].alignmentIdentity > .95){
            data[i].include = true;
            $scope.included += 1;
          }else{
            $scope.excluded += 1;
          }
        };
        $scope.referenceCpGSites = data[0].methylation.reference
        $scope.referenceLength = data[0].referenceLength
        $scope.analyses = data;
        $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
        var totalMethylation = 0
        for(var i = 0; i < $scope.percentMethylation.length; i++){
          totalMethylation += $scope.percentMethylation[i]['m']/($scope.percentMethylation[i]['m']+$scope.percentMethylation[i]['u'])
        }
        return (totalMethylation/$scope.percentMethylation.length);
      }
        return 0
    };
    $scope.getInfo = function(data){
        $scope.title = data[0].barcode + ": " + data[0].referenceName
        $scope.showAll = false;
        
        if (data.length > 0){
        $scope.excluded = 0
        $scope.included = 0
        for(i=0;i<data.length;i++){
          data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
          data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
          if (data[i].alignmentIdentity > .95){
            data[i].include = true;
            $scope.included += 1;
          }else{
            $scope.excluded += 1;
          }
        };
        $scope.referenceCpGSites = data[0].methylation.reference
        $scope.referenceLength = data[0].referenceLength
        $scope.analyses = data;
        $scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
      }
    };
    $scope.backToOverview = function(){
      $scope.showAll = true
    };
  	/*Resource.get(
  		{},
  		function(data){
  			$scope.excluded = 0
  			$scope.included = 0
  			for(i=0;i<data.length;i++){
  				data[i].alignmentIdentity = (data[i].alignment.length-data[i].alignment.mismatches)/data[i].alignment.length;
  				data[i].percentConversion = data[i].bisulfite.convertedCpH/(data[i].bisulfite.unconvertedCpH+data[i].bisulfite.convertedCpH);
  				if (data[i].alignmentIdentity > .95 && data[i].percentConversion > .75){
  					data[i].include = true;
  					$scope.included += 1;
  				}else{
  					$scope.excluded += 1;
  				}
  			}
  			$scope.referenceCpGSites = data[0].methylation.reference
  			$scope.referenceLength = data[0].referenceLength
  			$scope.analyses = data;
  			$scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
  	});*/
  	var generateMethylation = function(refSites,data){
  		var methylationSite = []
  		for(i=0;i<refSites.length;i++){
  			methylationSite[i] = {'location':refSites[i],'m':0,'u':0}
  		}
  		for(i=0;i<data.length;i++){
  			if (data[i].include){
  				for (j=0;j<data[i].methylation.sequence.length;j++){
  					if (data[i].methylation.sequence[j] == 'M'){
  						methylationSite[j]['m'] += 1
  					}else if (data[i].methylation.sequence[j] == 'U'){
  						methylationSite[j]['u'] += 1
  					}
  				}
  			}
  		}
  		return methylationSite;
  	}
  	$scope.percentMethylation = [];
  	$scope.setMethylation = function(){
  		$scope.percentMethylation = generateMethylation($scope.referenceCpGSites,$scope.analyses);
  	}
  	$scope.predicate = '1-(methylation.methylatedCpGSites/(methylation.methylatedCpGSites+methylation.cpGSites))'
  	$scope.includePredicate = 'include'
      //code here
  }]);
});

require.register("controllers/submitController", function(exports, require, module) {
angular.module('app.submitController', [])
  .controller('SubmitController', ['$scope','Resource',function($scope,Resource) {
    $scope.fastaSelect = function($files) {
    	var reader = new FileReader();
		reader.onload = function(e) {
  			$scope.fasta = reader.result;
		}
		reader.readAsText($files[0]);
    };
    $scope.refSelect = function($files) {
    	var reader = new FileReader();
		reader.onload = function(e) {
  			$scope.ref = reader.result;
		}
		reader.readAsText($files[0]);
    };
    $scope.mapSelect = function($files) {
    	var reader = new FileReader();
		reader.onload = function(e) {
  			$scope.map = reader.result;
		}
		reader.readAsText($files[0]);
	};
    $scope.submitForm = function() {
    	var toSubmit = {}
    	toSubmit['name'] = $scope.name;
    	toSubmit['email'] = $scope.email;
    	toSubmit['dna'] = $scope.fasta;
    	toSubmit['references'] = $scope.ref;
    	toSubmit['map'] = $scope.map;
    	Resource.add(toSubmit,function(success){
    		alert("Job submitted successfully.")
    	},function(error){
    		alert("Error in submition, please try again.")
    	});
    };
  }]);
});

require.register("controllers/userController", function(exports, require, module) {
angular.module('app.userController', [])
  .controller('UserController', ['$scope','User',function($scope,User) {
    $scope.initialView = true
    var initUser = function(user) {
        $scope.user = user
        console.log($scope.user);
        User.getAll({id:user.id,command:"maps"},function(success){
            $scope.user.maps = success;
        },function(error){
            alert(error);
        });
        User.getAll({id:user.id,command:"references"},function(success){
            $scope.user.references = success;
        },function(error){
            alert(error);
        });
    }
    $scope.getUser = function() {
        $scope.user = User.get({"email":$scope.email},function(success){
            initUser(success);
        },function(error){
            alert(error);
        });
        $scope.initialView = false
        $scope.userView = true
    };
    $scope.newUser = function() {
        var new_user = {};
        new_user.name = $scope.name
        new_user.email = $scope.email
        new_user.analyses = [];
        new_user.references = [];
        new_user.maps = [];
        new_user.params = [];
        User.add(new_user,function(success){
            initUser(success);
        },function(error){
            alert(error);
        });
        $scope.initialView = false
        $scope.userView = true
    };
    $scope.uploadMap = function() {
        var new_map = {};
        new_map.name = $scope.mapName
        new_map.value = $scope.map
        User.add({id:$scope.user.id,command:"maps"},new_map,function(success){
            initUser(success);
        },function(error){
            alert(error);
        });
    };
    $scope.uploadRef = function() {
        var new_ref = {};
        new_ref.name = $scope.refName
        new_ref.value = $scope.ref
        User.add({id:$scope.user.id,command:"references"},new_ref,function(success){
            initUser(success);
        },function(error){
            alert(error);
        });
    };
    $scope.submitForm = function() {
        User.add({id:$scope.user.id,command:"analyses", "name":$scope.name,"ref":$scope.selectRef.id,"map":$scope.selectMap.id},$scope.fasta, function(success){
            alert("Submitted!")
        },function(error){
            alert(error);
        });
    }
    $scope.fastaSelect = function($files) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.fasta = reader.result;
        }
        reader.readAsText($files[0]);
    };
    $scope.refSelect = function($files) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.ref = reader.result;
        }
        reader.readAsText($files[0]);
    };
    $scope.mapSelect = function($files) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.map = reader.result;
        }
        reader.readAsText($files[0]);
    };
  }]);
});

require.register("controllers/viewController", function(exports, require, module) {
angular.module('app.viewController', [])
  .controller('ViewController', ['$scope','Resource',function($scope,Resource) {
    $scope.showAll = true;
    //$scope.regions = Resource.get({id: $routeParams['id']})
    $scope.regions = Resource.get({})
}]);
});

require.register("directives/dot", function(exports, require, module) {
angular.module('dotDirective', [])
	.directive("dot", function() {
  return {
    restrict: "E",
    scope: {
        samples: '='
    },
    templateUrl: 'partials/methylationDot.html',
    replace: true,
    controller: [ '$scope', function ($scope) {
        var getRadius = function(samples){
          if (typeof samples === "undefined" || typeof samples.length === "undefined"){
            return 0;
          } else if (samples.length > 100){
            radius = 100
          } else if (samples.length < 20){
            radius = 20
          } else {
            radius = samples.length
          }
          return radius/4
        };
        var getMethylationLevel = function(data){
        if (typeof data === "undefined"){
            return 0;
        } else if (data.length > 0){
        $scope.excluded = 0
        $scope.included = 0
        for(i=0;i<data.length;i++){
          data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
          data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
          if (data[i].alignmentIdentity > .95){
            data[i].include = true;
            $scope.included += 1;
          }else{
            $scope.excluded += 1;
          }
        };
        var referenceCpGSites = data[0].methylation.reference
        var analyses = data;
        var percentMethylation = generateMethylation(referenceCpGSites,analyses);
        var totalMethylation = 0
        for(var i = 0; i < percentMethylation.length; i++){
          if (percentMethylation[i]['m'] + percentMethylation[i]['u']){
            totalMethylation += percentMethylation[i]['m']/(percentMethylation[i]['m']+percentMethylation[i]['u'])
          }
        }           
        return (totalMethylation/percentMethylation.length);
      }
        return 0
    };
    var generateMethylation = function(refSites,data){
        var methylationSite = []
        for(i=0;i<refSites.length;i++){
            methylationSite[i] = {'location':refSites[i],'m':0,'u':0}
        }
        for(i=0;i<data.length;i++){
            if (data[i].include){
                for (j=0;j<data[i].methylation.sequence.length;j++){
                    if (data[i].methylation.sequence[j] == 'M'){
                        methylationSite[j]['m'] += 1
                    }else if (data[i].methylation.sequence[j] == 'U'){
                        methylationSite[j]['u'] += 1
                    }
                }
            }
        }
        return methylationSite;
    }
        $scope.methylation = getMethylationLevel($scope.samples)
        $scope.radius = getRadius($scope.samples);
    }]
  }
});
});

require.register("filters/markdown", function(exports, require, module) {
angular.module('markdown', [])
    .filter('markdown', function () {
        var converter = new Showdown.converter();
        return function (text,user) {
            var markdown = text || '';
            var html =  converter.makeHtml(markdown).replace('{{user}}',user.firstName);
            return html;
        };
    });

//https://github.com/vpegado/angular-markdown-filter/blob/master/markdown.js
});

;require.register("main", function(exports, require, module) {
'use strict';
require('controllers/controllers');
require('controllers/submitController')
require('controllers/userController')
require('controllers/viewController')
require('services/resource');
require('services/user');
require('filters/markdown');
require('directives/dot');

// Declare app level module which depends on filters, and services
angular.module('app', ['ngRoute','ngCookies','app.controllers','app.submitController','angularFileUpload','app.userController','app.viewController','app.services.resource','app.services.user','ui.bootstrap.datetimepicker','markdown','dotDirective']).
config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/welcome.html', controller: 'UserController'});
  $routeProvider.when('/view/:id', {templateUrl: 'partials/main.html', controller: 'MainController'});
  $routeProvider.when('/test', {templateUrl: 'partials/view.html', controller: 'ViewController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
});

require.register("services/resource", function(exports, require, module) {
var resourceServices = angular.module('app.services.resource', ['ngResource']);
 
resourceServices.factory('Resource', ['$resource','$window',
  function($resource,$window){
    return $resource('data.json',{},
    	{
    	 'get': { method: 'GET' }
    	     	}
    );
  }]);
});

require.register("services/user", function(exports, require, module) {
var userService = angular.module('app.services.user', ['ngResource']);
 
userService.factory('User', ['$resource','$window',
  function($resource,$window){
    return $resource('api/user/:id/:command',{},
    	{
    	 'get': { method: 'GET' },
    	 'getAll': { method: 'GET', isArray: true},
    	 'add': { method: 'POST' }
    	}
    );
  }]);
});


//# sourceMappingURL=app.js.map