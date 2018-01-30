MYapp.controller('ClasesCtrl', function ($scope, ResourceItem, ResourceCategories, ResourceMedia, globalF, $cookies, $location, $rootScope, ngDialog, Upload, $timeout) {
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


    ResourceCategories.get({act: 'all'}, function (res) {
        globalF.toastr_msj(res);
        globalF.pagination(res);
        $rootScope.cat = res;
    });

    ResourceMedia.get({act: 'all'}, function (res) {
        globalF.toastr_msj(res);
        globalF.pagination(res);
        $rootScope.media = res;
    });

    ResourceItem.get({act: 'all'}, function(res){
        globalF.toastr_msj(res);
        globalF.pagination(res);
        $rootScope.response = res;
        $rootScope.response.data.id_image = ''; 
    });

    $scope.value = "Guardar";

    $scope.open_newitem = function () {
        
        ngDialog.open({
            template: client_url + '/views/modal/createItemModal.html',
            plain: false,
            showClose: false,
            controller: 'ClasesCtrl'
        });
    }

    $scope.i = {};

    $scope.upload_post = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {
                    Upload.upload({
                        url: api_url+'/api/upload',
                        data: {
                            id_usr: $rootScope.session.data_session.data.id,
                            file: file,
                        }
                    }).then(function (res) {
                        if(res.data.status=='success'){
                            console.log(res.data.data);

                             $scope.i.img = res.data.data;

                            $rootScope.id_image = res.data.id;
                            console.log($scope.i.img);
                        }
                    });
                }
            }
        }
    };

    $scope.upload_put = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {
                    Upload.upload({
                        url: api_url+'/api/upload',
                        data: {
                            id_usr: $rootScope.session.data_session.data.id,
                            file: file,
                        }
                    }).then(function (res) {
                        if(res.data.status=='success'){
                            console.log(res.data.data);
                            
                            $scope.item_form.image.path = res.data.data;
                          
                            $rootScope.id_image = res.data.id;
                            console.log($scope.i.img);
                        }
                    });
                }
            }
        }
    };

    $scope.create = function (value) {
        $scope.i.id_cat = $scope.cat_user;
        $scope.i.id_user = $rootScope.session.data_session.data.id;
        $scope.i.id_image = $rootScope.id_image;
        ResourceItem.post($scope.i,function(res){
            if(res.status=='success'){
                ResourceItem.get({act: 'all'}, function (res) {
                    globalF.toastr_msj(res);
                    globalF.pagination(res);
                    $rootScope.response = res;
                    $scope.i = {};
                    $scope.closeThisDialog(0);
                });
            }
        });
    };

    $scope.profile = function (n) {
        console.log(n);
        /*------*/
        ResourceItem.get({act: 'once', id_item: n}, function (res) {
            globalF.toastr_msj(res);
            $scope.step.first = false;
            $scope.step.second = true;
            $rootScope.id_item = n;
            $scope.item_form = res.data;
            if($scope.item_form.start_at)
                $scope.item_form.start_at = new Date($scope.item_form.start_at); 
        });
    }   

    $scope.update_item = function(){
        $scope.item_form.id_item = $rootScope.id_item;
        console.log($rootScope.id_image);

        if($rootScope.id_image)
            $scope.item_form.id_image = $rootScope.id_image;
        
        $scope.item_form.id_user = $rootScope.session.data_session.data.id;
        

        ResourceItem.put($scope.item_form,function(res){
            if(res.status=='success'){
                ResourceItem.get({act: 'all'}, function (res) {
                    globalF.toastr_msj(res);
                    globalF.pagination(res);
                    $rootScope.response = res;
                    $scope.item_form = {};
                });
            }
        });
        console.log('update categories');
    }
           
    $scope.delete = function(item){
        $scope.res = confirm("Está seguro de eliminar este usuario");

        if($scope.res){
            $scope.id_item = item.id;
            console.log($scope.id_item);
            ResourceItem.delete({id_item: $scope.id_item},function(res){
                if(res.status=='success'){
                    ResourceItem.get({act: 'all'}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $scope.item_form = {};
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