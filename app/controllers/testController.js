angular.module('app.testController', [])
  .controller('TestController', ['$scope','nameExp',function($scope, nameExp) {

var data = [ { x: 1910, y:2 }, { x: 1920, y:1}, { x: 1930 , y:2 }, { x: 1940, y:0 } ];

$scope.stats = new Rickshaw.Graph( {
        element: document.querySelector("#chart"),
        width: 580,
        height: 250,
        renderer: 'scatterplot',
        series: [ {
                color: 'steelblue',
                data: data
        } ]
} );

$scope.stats.render();

nameExp('m140801_003556_42177R_c100668802550000001823128802061551_s1_p0/20123/ccs', '/\/([^/]+)\//');



}]);