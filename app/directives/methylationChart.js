angular.module('methylationChart', []) // Angular Module Name
    .directive('methylation', [function () { // Angular Directive
      return {
        restrict: 'E',
        scope: {
          datajson: '=',
          width: '=',
          height: '=',
          regionName: '=',
          sampleName: '=',
          included: '=',
          showNumbers: '=',
          whitespace: '=',
          identityCutoff: '='
                // All the Angular Directive Vaiables used as d3.js parameters
              },
              link: function (scope, elem, attrs) {

                console.log(scope.showNumbers)
                console.log(scope.datajson)
                if(scope.datajson){
                  render(); //if already loaded from memory
                }

                scope.$watch("included", function(newVal, oldVal){
                  if(newVal !== oldVal){
                    console.log("included list changed"); //work on this in the viewController
                    console.log(newVal)
                    render(); //new page and also list changed
                  }
                });

                function render(){
                  console.log("rerendering...")
                  console.log(scope.datajson)
                  d3.select(elem[0]).selectAll("svg").remove(); //resets

                  var width = scope.width,
                  height = scope.height;

                  var data = scope.datajson

                  var x = d3.scale.linear()
                  .domain([0, width])
                  .range([0, width]);

                  var y = d3.scale.linear()
                  .domain([-10, height])
                  .range([height, 0]);

                  var zzzm = d3.behavior.zoom().x(x).scaleExtent([1, 8]).on("zoom", zoom)

                  var svg = d3.select(elem[0]).append("svg")
                  .attr("id", "methylationStatus")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .call(zzzm);

                  svg.append("rect")
                  .attr("class", "overlay")
                  .attr("width", width)
                  .attr("height", height);

                  var rect = svg.selectAll("rect")
                  .data(data)
                  .enter()

                  tip = d3.tip().attr('class', 'd3-tip').html(function(d){ return "Methylation: "+d.mRatio;});

                  svg.call(tip)

                  var shapeRect = rect.append("rect")
                  .attr("height", 30)
                  .attr("width", 10)
                  .attr("fill", setColor)
                // .attr("opacity", getTint)
                  .attr("transform", transform)
                  .on("mouseover", tip.show)
                  .on("mouseout", tip.hide)

                if(!scope.showNumbers){
                  
                }
                else{
                var textRect = rect.append("text").text(getText).attr("transform", transformText)
              }

            function setColor(d) {
              var blue = Math.round(254 - (d.meth * 2.54));
              var red = Math.round(d.meth * 2.54);
              return 'rgb(' + red + ',0,' + blue + ')';
            };

            // function getTint(d){
            //   return d.meth
            // }

            function getText(d){
              return d.x
            }

            function zoom() {
              shapeRect.attr("transform", transform);
              if(!scope.showNumbers){
                
              }
              else{
              textRect.attr("transform", transformText);
            }

            }

            function transform(d, i) {
              if(!scope.whitespace)
              return "translate(" + x(i) + "," + y(70) + ")";
              else{
                return "translate(" + x(d.x) + "," + y(70) + ") scale(" + zzzm.scale()/10 + "," + 1 + ")";
              }
            }

              function transformText(d,i) {

                if(!scope.whitespace)
                return "translate(" + x(i+.5) + "," + y(35) + ")";
                else{
                  return "translate(" + x(d.x+1) + "," + y(35) + ")";
                }
              }

              console.log("finished")
              // console.log(d3.select(elem[0]))
              // console.log(d3.select(elem[0]).selectAll("svg"))
            }
}
}
}]);
