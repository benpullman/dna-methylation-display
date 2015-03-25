angular.module('app.set', []).factory('setter', function() {
 var identityCutoff = .95;
 var regex = ""
 var methylation

 function setCutoff(data) {
   identityCutoff = data;
 }
 function getCutoff() {
  return identityCutoff;
 }
 function setRegex(data){
 	regex = data;
 }
 function getRegex(){
 	return regex;
 }

 function setMethylation(data){
 	methylation = data
 }

 function getMethylation(){
 	return methylation
 }

 return {
  setCutoff: setCutoff,
  getCutoff: getCutoff,
    getRegex: getRegex,
    setRegex: setRegex,
    getMethylation: getMethylation,
    setMethylation: setMethylation

 }

});