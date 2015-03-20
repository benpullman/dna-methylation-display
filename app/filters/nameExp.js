angular.module('nameExp', [])
    .filter('nameExp', function () {
        return function(name,regex){
        	// console.log(name.match(new RegExp(regex)));
        	if(typeof regex == 'undefined')
        		return name
        	try{
	            var i = (name).match(new RegExp(regex));
	            if(typeof i != 'undefined' && i != null){
	            	return i[1];
	            }
	            console.log("null")
	            return "Nothing was captured in your group"
        	}
        	catch(err){
        		return "Incorrect Regex Expression"
        	}
        };
    });