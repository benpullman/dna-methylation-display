angular.module('methylationChart', []) // Angular Module Name
    .directive('methylation', ['loadData', function (loadData) { // Angular Directive
      return {
        restrict: 'E', 
        scope: {
          datajson: '=',
          width: '=',
          height: '=',
          d3Format: '=',
          regionName: '=',
          sampleName: '=',
          included: '=',
          showNumbers: '=',
          whitespace: '='
                // All the Angular Directive Vaiables used as d3.js parameters
              },
              link: function (scope, elem, attrs) {

                console.log(scope.showNumbers)


                scope.$watch("included", function(newVal, oldVal){
                  if(newVal !== oldVal){
                    console.log("included list changed"); //work on this in the viewController
                    console.log(newVal)
                  }
                });

                loadData.load().then(function(loaded){

                  var regions = loaded.all.regions; 
                  console.log(loaded.all.regions);
                  var allSamples = loaded.sampleNames;
                  var data = regions[scope.regionName].samples[scope.sampleName].analyses
                  var excluded = 0
                  var included = 0
                  for(i=0;i<data.length;i++){
                    data[i].alignmentIdentity = (data[i].alignment.end-data[i].alignment.start-data[i].alignment.mismatches-data[i].alignment.gaps)/(data[i].alignment.end-data[i].alignment.start);
                    data[i].percentConversion = data[i].methylation.methylated/(data[i].methylation.methylated+data[i].methylation.unmethylated);
                    if (data[i].alignmentIdentity > .95){
                      data[i].include = true;
                      included += 1;
                    }else{
                      excluded += 1;
                    }
                  };
                  var refSites = data[0].methylation.reference
                  var referenceLength = data[0].referenceLength
                  scope.datajson = []
                  methylationSite = []
                  for(i=0;i<refSites.length;i++){
                    methylationSite[i] = {'m':0, 'u':0}
                  }

                  for(i=0;i<data.length;i++){
                   if (data[i].include){
                    // console.log(i+"Sample "+data[i].sampleName+"is included")
                    for (j=0;j<data[i].methylation.sequence.length;j++){
                     if (data[i].methylation.sequence[j] == 'M'){
                       methylationSite[j]['m'] += 1
                     }else if (data[i].methylation.sequence[j] == 'U'){
                       methylationSite[j]['u'] += 1
                     }
                   }
                 }
               }

               console.log(methylationSite)
               console.log(refSites.length)

               for(i=0; i<refSites.length;i++){
                var denom = 0;
                var num = 0;
                if(methylationSite[i]['m']+methylationSite[i]['u'] == 0){
                  denom = 1
                }
                else{
                  denom = methylationSite[i]['m']+methylationSite[i]['u']
                }

                num = methylationSite[i]['m']

                scope.datajson[i] = {'x': refSites[i], 'meth':num/denom * 100, 'mRatio': num + '/' + (methylationSite[i]['m']+methylationSite[i]['u'])}
              }

              var width = scope.width,
              height = scope.height;

              var data = scope.datajson

              var x = d3.scale.linear()
              .domain([0, width])
              .range([0, width]);

              var y = d3.scale.linear()
              .domain([0, height])
              .range([height, 0]);

              var zzzm = d3.behavior.zoom().x(x).scaleExtent([1, 8]).on("zoom", zoom)

              var svg = d3.select(elem[0]).append("svg")
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
          return "translate(" + x(i) + "," + y(70) + ") scale(" + zzzm.scale()/10 + "," + 1 + ")";
          else{
            return "translate(" + x(d.x) + "," + y(70) + ");
          }
        }

        function transformText(d,i) {

          if(!scope.whitespace)
          return "translate(" + x(i+.5) + "," + y(35) + ")";
          else{
            return "translate(" + x(d.x+1) + "," + y(35) + ")";
          }
        }

      });
}
}
}]);
