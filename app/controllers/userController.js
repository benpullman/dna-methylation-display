angular.module('app.userController', [])
  .controller('UserController', ['$scope','User','Resource','$http','$location','$modal',function($scope,User,Resource,$http,$location,$modal) {
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
        console.log($scope.email)
        $scope.user = User.get({"email":$scope.email},function(success){
            initUser(success);
            console.log(success)
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
            console.log(success)
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
    // $scope.submitForm = function() {
    //     // User.add({id:$scope.user.id,command:"analyses", "name":$scope.name,"ref":$scope.selectRef.id,"map":$scope.selectMap.id},$scope.fasta, function(success){
    //     //     alert("Submitted!")
    //     // },function(error){
    //     //     alert(error);
    //     // });
    //     // var toSubmit = {}
    //     //     // toSubmit['name'] = $scope.name;
    //     //     // toSubmit['email'] = $scope.email;
    //     // toSubmit['dna'] = $scope.fasta;
    //     // console.log($scope.fasta)
    //     // // toSubmit['references'] = $scope.ref;
    //     // // toSubmit['map'] = $scope.map;
    //     // Resource.add(toSubmit,function(success){
    //     //     alert("Job submitted successfully.")
    //     // },function(error){
    //     //     alert("Error in submition, please try again.")
    //     // });
    //     console.log($scope.email)
    //     var fd = new FormData();
    //     fd.append('reference', $scope.ref);
    //     fd.append('map', $scope.map);
    //     fd.append('sample', $scope.fasta);
    //     $http.post('/api/?email=' + $scope.email, data = fd, {
    //         transformRequest: angular.identity,
    //         headers: {'Content-Type': undefined}
    //     })
    //     .success(function(data){
    //         console.log('/view/' + data)
    //     })
    //     .error(function(){
    //     });
    //     // $http({
    //     //     method:'POST',
    //     //     url:'/api/',
    //     //     headers: {'Content-Type': 'multipart/form-data'},
    //     //     //transformRequest: angular.identity,
    //     //     data: $scope.fasta
    //     //   }).success(function(d){

    //     //   }).error(function(e){

    //     //   });
    // }
    $scope.submitForm = function() {
        $scope.submitted = true;
        $scope.error = false;
        $http.get('/api/initialize?email=' + $scope.email)
        .success(function(data){
            uploadAll(parseInt(data))
        })
        .error(function(){
            makeError()
        });
        console.log($scope.email)
    }
    var uploadAll = function(jobIndex) {
        var fd_ref = new FormData();
        var fd_map = new FormData();
        var fd_sam = new FormData();
        fd_ref.append('reference', $scope.ref);
        fd_map.append('map', $scope.map);
        fd_sam.append('sample', $scope.fasta);
        $http.post('/api/upload/' + jobIndex + '/map', data = fd_map, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(d){
            $http.post('/api/upload/' + jobIndex + '/reference', data = fd_ref, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(d){
                $http.post('/api/upload/' + jobIndex + '/sample', data = fd_sam, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(d){
                    $location.path("/view/" + jobIndex) //redirect
                }).error(function(e){
                    makeError()
                });
            }).error(function(e){
                makeError()
            });
        }).error(function(e){
            makeError()
        });
        // $http.post('/api/upload/' + jobIndex + '/sample', data = fd_sam, {
        //     transformRequest: angular.identity,
        //     headers: {'Content-Type': undefined}
        // })
    }
    var makeError = function(){
        $scope.submitted = false;
        $scope.error = true;
    }
    var uploadSample = function(jobIndex) {
        $http.post('/api/upload/' + jobIndex + '/sample', data = fd_sam, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
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
    $scope.referenceExample = function() {
      console.log("clicked for reference info")
      $modal.open({
        templateUrl: 'partials/modal/reference-example.html',
        size: 'md',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
          $scope.change = function(){
            console.log("Looking at reference Example")
          };
        }]
      });
    };
    $scope.barcodeExample = function() {
      console.log("clicked for barcode info")
      $modal.open({
        templateUrl: 'partials/modal/barcode-example.html',
        size: 'md',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
          $scope.change = function(){
            console.log("Looking at barcode Example")
          };
        }]
      });
    };
  }]);
