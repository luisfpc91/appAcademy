MYapp.controller('CategoriesCtrl', function ($scope, ResourceCategories, globalF, $cookies, $location, $rootScope, ngDialog, Upload, $timeout) {
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

        ResourceCategories.get({act: 'all'}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
        });

        $scope.value = "Guardar";

        $scope.open_newuser = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_user = id;
            } else {
                $rootScope.id_user = null;
            }
            ngDialog.open({
                template: client_url + '/views/modal/createCategoriesModal.html',
                plain: false,
                showClose: false,
                controller: 'CategoriesCtrl'
            });
        }

        $scope.profile = function (n) {

            console.log(n);
            /*------*/
            ResourceCategories.get({act: 'once', id: n}, function (res) {
                globalF.toastr_msj(res);
                $scope.step.first = false;
                $scope.step.second = true;
                $rootScope.id_cat = n;
                $scope.profile_form = res.data;
            });
        }

        $scope.create = function (value) {
            ResourceCategories.add($scope.form,function(res){
                if(res.status=='success'){
                    ResourceCategories.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $scope.form = {};
                        $scope.closeThisDialog(0);
                    });
                }
            });
        };

        $scope.update_cat = function(){
            $scope.profile_form.id_cat = $scope.profile_form.id; 
            ResourceCategories.update($scope.profile_form,function(res){
                if(res.status=='success'){
                    ResourceCategories.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $scope.profile_form = {};
                    });
                }
            });
            console.log('update categories');
        }

        $scope.cancel = function(){
            if($scope.value == 'Editar'){
                $scope.value = "Guardar";
                $scope.form = {};
            }
            else{
                $scope.form = {};
            }
        }

        $scope.edit = function(item){
            $scope.form = angular.copy(item);
            $scope.value = "Editar";
        };


           
        $scope.delete = function(item){
            $scope.res = confirm("Está seguro de eliminar este usuario");

            if($scope.res){
                $scope.cat_id =  item.id;
                console.log($scope.cat_id);
                ResourceCategories.delete({id: $scope.cat_id},function(res){
                    if(res.status=='success'){
                        ResourceCategories.get({act: 'all'}, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                            $scope.profile_form = {};
                        });
                    }
                    console.log('delete categories');
                });
             }else{
                return false;
            }    
        };

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceCategories.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        };

});