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