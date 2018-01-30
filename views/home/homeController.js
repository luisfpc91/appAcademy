MYapp.controller('IndexHomeCtrl', function ($scope, ResourceItem, ResourceNotification, ResourceMedia, ResourceUsers, globalF, $cookies, $location, $rootScope) {
    globalF.validate_session();
    $rootScope.current_page = 'home';

    $scope.level = $rootScope.session.data_session.data.level;

    $scope.admin = function(){
        if($scope.level != 'admin')
            $scope.cat_user = $rootScope.session.data_session.data.categorie.id;
        else
            $scope.cat_user = 0;
    } 
    $scope.admin();  

    console.log($scope.level);

    ResourceUsers.get({act: 'all'}, function(res){
    	$rootScope.users = res;
    });

    ResourceMedia.get({act: 'all'}, function(res){
    	$rootScope.media = res;
    });

    ResourceNotification.get({
        id_user: $rootScope.session.data_session.data.id
        }, function(res){
    	$rootScope.noti = res;
    });

    ResourceItem.get({act: 'all'}, function(res){
    	$rootScope.item = res;
    });

	$scope.limit = 5; 

    $scope.nivel = {'user':'Alumno','manager':'Profesor','admin':'Administrador'};

});