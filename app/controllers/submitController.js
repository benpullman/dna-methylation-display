angular.module('app.submitController', [])
  .controller('SubmitController', ['$scope','$modal','Resource',function($scope,$modal,Resource) {
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
    	// toSubmit['name'] = $scope.name;
    	// toSubmit['email'] = $scope.email;
    	toSubmit['dna'] = $scope.fasta;
    	// toSubmit['references'] = $scope.ref;
    	// toSubmit['map'] = $scope.map;
    	Resource.add(toSubmit,function(success){
    		alert("Job submitted successfully.")
    	},function(error){
    		alert("Error in submition, please try again.")
    	});
    };

    $scope.FASTAExample = function() {
      console.log("clicked for FASTA info")
      $modal.open({
        templateUrl: 'partials/modal/fasta-example.html',
        size: 'md',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
          $scope.change = function(){
            console.log("Looking at FASTA Example")
          };
        }]
      });
  };

  }]);
