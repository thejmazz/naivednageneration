angular.module('myApp', [])

.controller('bodyCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.name = 'bob';
    $scope.home = 'Toronto';

    $scope.done = false;
    $scope.currentSeq;

    $scope.genDNA = function() {
        $http.post('http://localhost:9001/genDNA', {
            arg: $scope.numNts,
        }).success(function(data) {
            $scope.currentSeq = data.output;
            $scope.done = true;
        })
    };

    $scope.seqs;

    $scope.getSeqs = function() {
        $http.get('http://localhost:9001/dnas').success(
            function(data) {
                $scope.seqs = data;
            })
    };
}])
