angular.module('methylationChart', []) // Angular Module Name
    .directive('methylation', ['loadData', function (loadData) { // Angular Directive
        return {
            restrict: 'E', 
            scope: {
                datajson: '=',
                xaxisName: '=',
                xaxisPos: '=',
                d3Format: '=',
                regionName: '=',
                sampleName: '='
                // All the Angular Directive Vaiables used as d3.js parameters
            },
            link: function (scope, elem, attrs) {

               // var yAxis = d3.svg.axis()
               //         .scale(y)
               //         .orient("left")
               //         .tickFormat(formatPercent);

              // svg.append("rect")
              // .attr("class", "overlay")
              // .attr("width", width)
              // .attr("height", height);

              // d3.json(scope.datajson, function(error, data) { // external data filename- angular directive variable
              //     if (error) return console.warn(error);

                  // x.domain(data.map(function(d) { return d.letter; }));
                  // y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

                  loadData.load().then(function(loaded){
                    // The d3.js code for generation of bar graph. further reading should be done from http://d3js.org/
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    // height = 500 - margin.top - margin.bottom;
                    height = 100;

               //  var formatPercent = d3.format(scope.d3Format); // formatting via angular variable

                var x = d3.scale.linear()
                .domain([0, width])
                .range([0, width]);

              var y = d3.scale.linear()
    .domain([0, height])
    .range([height, 0]);

               // var xAxis = d3.svg.axis()
               //         .scale(x)
               //         .orient("bottom");

                var svg = d3.select(elem[0]).append("svg") // selecting the DOM element by d3.js 
                                                                 // - getting from Angular context   
                   .attr("width", width + margin.left + margin.right) //100%
                   // .attr("height", height + margin.top + margin.bottom) //100
                   .attr("height", 100)
                   .append("g")
                   .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));


                  var g = svg.selectAll('g')
 
                  // var block = g.data(scope.datajson)
                  //     .enter()
                  var block = svg.selectAll("rect").data(scope.datajson).enter()

                  var aTest = function (i) {
                      return i / 100;
                  };

                  block.append('rect')
                      .attr({
                      height: 40,
                      width: 10,
                      // x: function (d) {
                      //     return 3 * d.x
                      // },
                      // y: 50,
                      fill: 'red',
                      opacity: function (d) {
                          return aTest(d.meth)
                      },
                      transform: transform


                  });

                  // block.append('rect')
                  //     .attr({
                  //     height: 40,
                  //     width: 10,
                  //     // x: function (d) {
                  //     //     return 3 * d.x
                  //     // },
                  //     // y: 50,
                  //     fill: 'blue',
                  //     opacity: function(d){
                  //         return 1-aTest(d.meth)
                  //     },
                  //     transform: transform
                  // });

              function zoom() {
                console.log("zooming")
                block.attr("transform", transform);
              }

              function transform(d) {
                return "translate(" + d.x + "," + y(50) + ")";
              }
        // console.log(loaded);
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
                    // methylationSite[i] = {'m':0, 'u':0}
                    scope.datajson[i] = {'x': refSites[i], 'meth':50}
                  }

                  // for(i=0;i<data.length;i++){
                  //  if (data[i].include){
                  //    for (j=0;j<data[i].methylation.sequence.length;j++){
                  //      if (data[i].methylation.sequence[j] == 'M'){
                  //        methylationSite[j]['m'] += 1
                  //      }else if (data[i].methylation.sequence[j] == 'U'){
                  //        methylationSite[j]['u'] += 1
                  //      }
                  //      var score = methylationSite[j]['m']/(methylationSite[j]['u']+methylationSite[j]['m'])*100
                  //      if(typeof score == 'NaN') score == 0
                  //      scope.datajson.push({'x':refSites[i],'meth':score})
                  //    }
                  //  }
                  // }

                  console.log(scope.datajson)

              });
           }
        }
       }]);
