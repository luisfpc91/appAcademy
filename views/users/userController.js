MYapp.controller('UsersCtrl', function ($scope, ResourceUsers, ResourceCategories, globalF, $cookies, $location, $rootScope, ngDialog, Upload, $timeout) {
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

        $scope.level = $rootScope.session.data_session.data.level;

        $scope.admin = function(){
            if($scope.level != 'admin')
                $scope.cat_user = $rootScope.session.data_session.data.categorie.id;
            else
                $scope.cat_user = 0;
        } 
        $scope.admin();  

        console.log($scope.level);

        ResourceUsers.get({act: 'all'}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
        });

        $scope.nivel = {'user':'Alumno','manager':'Profesor','admin':'Administrador'};

        ResourceCategories.get({act: 'all'}, function(res){
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.cat = res;
        })

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: api_url+'/api/upload',
                            data: {
                                username: $scope.username,
                                file: file,
                                id_usr:$rootScope.id_user
                            }
                        }).then(function (res) {
                            if(res.data.status=='success'){
                                $scope.profile_form.avatar = res.data.data;
                                ResourceUsers.get({act: 'all'}, function (res) {
                                    globalF.toastr_msj(res);
                                    globalF.pagination(res);
                                    $rootScope.response = res;
                                });
                            }
                        });
                    }
                }
            }
        }

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceUsers.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }


        $scope.$watch('file_', function () {
            console.log('----READY');
            if ($scope.file_ != null) {
                $scope.files = [$scope.file_];
            }
        });

        $scope.open_newuser = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_user = id;
            } else {
                $rootScope.id_user = null;
            }
            ngDialog.open({
                template: client_url +  '/views/modal/createUserModal.html',
                plain: false,
                showClose: false,
                controller: 'CreateUsersCtrl'
            });
        }

        $scope.profile = function (n) {

            console.log(n);
            /*------*/
            ResourceUsers.get({act: 'user', id: n}, function (res) {
                globalF.toastr_msj(res);
                $scope.step.first = false;
                $scope.step.second = true;
                $rootScope.id_user = n;
                $scope.profile_form = res.data;
                $scope.profile_form.bod = new Date(res.data.bod);
                if(res.data.categorie){
                    $scope.profile_form.categorie = res.data.categorie.id;
                }else {
                    $scope.profile_form.categorie = null;
                }

                $scope.profile_form.cate_update = res.data.categorie;
            });
        }

        $scope.delete = function(item){

            $scope.res = confirm("Está seguro de eliminar este usuario");

            if($scope.res){
                $scope.id =  item.id;  
                ResourceUsers.delete({id: $scope.id},function(res){
                    if(res.status=='success'){
                        ResourceUsers.get({act: 'all'}, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                            $scope.profile_form = {};
                        });
                    }
                    console.log('delete user');
                });
            }else{
                return false;
            }
        }

        $scope.open_password = function (id) {
            if (id) {
                $rootScope.id_user = id;
            } else {
                $rootScope.id_user = null;
            }

            ngDialog.open({
                template: client_url + '/views/modal/editPassModal.html',
                plain: false,
                showClose: false,
                controller: 'CreateUsersCtrl'
            });
        }

        $scope.cate_update;
        $scope.update_user = function(){
            console.log($scope.profile_form.categorie);
            $scope.profile_form.categorie = $scope.profile_form.categorie;

            ResourceUsers.update($scope.profile_form,function(res){
                console.log('<<<<<<<>>>>>>>>>');
                console.log(res);
                if(res.status=='success'){
                    ResourceUsers.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                    });
                }
            })
        }
    })
    .controller('CreateUsersCtrl', function ($scope, ResourceUsers, globalF, $rootScope, Upload, ResourcePassword) {
        globalF.validate_session();
        $scope.newpass = {}, $scope.email_disabled = false, $scope.swt = false,$scope.newuser = {avatar:null};
        $scope.title = "Crear Nuevo Usuario";
        $scope.button = "Guardar";

        console.log('ready modal');

        $scope.level = $rootScope.session.data_session.data.level;
        console.log($scope.level);  

        $scope.admin = function(){
            if($scope.level != 'admin')
                $scope.cat_user = $rootScope.session.data_session.data.categorie.id;
            else
                $scope.cat_user = 0;
        }; 
        $scope.admin();  

        $scope.update_pass = function () {
            $scope.newpass.id_user = $rootScope.id_user;
            $scope.newpass.act = 'password';
            console.log($scope.newpass);
            
            ResourcePassword.change($scope.newpass,function(res){
                console.log('<<<<<<<>>>>>>>>>');
                console.log(res);
                if(res.status=='success'){
                    ResourceUsers.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $scope.closeThisDialog(0);
                    });
                }
            });
        };

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: api_url+'/api/upload',
                            data: {
                                username: $scope.username,
                                file: file,
                            }
                        }).then(function (res) {
                            if(res.data.status=='success'){

                               $scope.newuser.avatar = res.data.data;
                               
                            }
                        });
                    }
                }
            }
        };
        
        $scope.create = function () {
            $scope.newuser.categorie = $scope.cat_user; 
            ResourceUsers.add($scope.newuser,function(res){
                if(res.status=='success'){
                    ResourceUsers.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                    });
                    $scope.closeThisDialog(0);
                }
            });
            console.log('create user');
            console.log($scope.newuser);
        };
    })