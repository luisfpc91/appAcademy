MYapp.controller('NotificationCtrl', function ($scope, ResourceNotification, ResourceFCM, globalF, $cookies, $location, $rootScope, ngDialog, Upload, $timeout) {
        globalF.validate_session();
        $rootScope.response = {};
        $scope.response_user = {};
        $scope.profile_form = {};
        $scope.file_inp = {};
        $scope.level_item = ['user','admin'];
        $scope.step = {
            first: true,
            second: false
        }

        $scope.value = "Enviar";

        ResourceFCM.get({ act: 'all', id_usr: $rootScope.session.data_session.data.id },function(res){
            $rootScope.data = res;
        });

        $scope.token = function(item){
            $rootScope.token = {};
            $rootScope.token = item.token_fcm;
            $rootScope.name = item.id_user;
            console.log($rootScope.token);
        }

        $scope.open_newNotification = function(){
            ngDialog.open({
                template: client_url + '/views/modal/createNotificationModal.html',
                plain: false,
                showClose: false,
                controller: 'NotificationCtrl'
            });
        }

        ResourceNotification.get({
            id_user: $rootScope.session.data_session.data.id
            }, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
            $scope.form = {};
        });

        $scope.create = function () {
            $scope.form.token_device = $rootScope.token;
            $scope.form.act = 'topic';
            $scope.form.id_user = $rootScope.session.data_session.data.id;
            $scope.form.topic = $rootScope.session.data_session.data.categorie.id;

            ResourceNotification.add($scope.form,function(res){
                $scope.closeThisDialog(0);
                if(res.message_id){
                    ResourceNotification.get({id_user: $rootScope.session.data_session.data.id}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $scope.form = {};
                    });
                }
            });
            console.log('create Notification');   
        };

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceFCM.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        };

});