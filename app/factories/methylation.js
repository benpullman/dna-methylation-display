angular.module('app.methylation', []).
factory('methylation', [function() {
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
    };
	return{
		getMethylationLevel: function(data){
        if (typeof data === "undefined"){
            return 0;
        } else if (data.length > 0){
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
        var referenceCpGSites = data[0].methylation.reference
        var analyses = data;
        var percentMethylation = generateMethylation(referenceCpGSites,analyses);
        var totalMethylation = 0
        for(var i = 0; i < percentMethylation.length; i++){
          if (percentMethylation[i]['m'] + percentMethylation[i]['u']){
            totalMethylation += percentMethylation[i]['m']/(percentMethylation[i]['m']+percentMethylation[i]['u'])
          }
        }           
        return {'methylationLevel':totalMethylation/percentMethylation.length,'included':included, 'excluded':excluded};
      }
        return 0
    }
	}
}]);