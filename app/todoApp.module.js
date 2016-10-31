(function(angular) {

//creo il modulo e seleziono un tema predefinito

angular.module('todoApp', ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('deep-orange');
});

})(window.angular);