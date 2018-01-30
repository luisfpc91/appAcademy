MYapp.controller('MultimediaCtrl', function ($scope, ResourceMedia, globalF, $cookies, $location, $rootScope,ngDialog,ResourceCategories){
    globalF.validate_session();
    $scope.response_categories = [{id:0,description:'Todas',name:'Todas'}];
    $scope.step = {
        first: true,
        second: false
    };

    $scope.level = $rootScope.session.data_session.data.level;

    $scope.admin = function(){
        if($scope.level != 'admin')
            $scope.cat_user = $rootScope.session.data_session.data.categorie.id;
        else
            $scope.cat_user = 0;
    } 
    $scope.admin();  

    console.log($scope.level);
    

    ResourceCategories.get({act:'all'},function(res){
        globalF.toastr_msj(res);
        if(res.status=='success'){
            for(var i in res.data){
                $scope.response_categories.push(res.data[i]);
            }

        }
    });

    $scope.datos = function(){

        if($scope.level == 'admin'){
            params_fil = {act:'all',filter:false};
        }else{
            params_fil = {act:'filter',filter:$scope.cat_user};    
        }

        console.log(params_fil);
        ResourceMedia.get(params_fil,function(res){
            globalF.toastr_msj(res);
            if(res.status=='success'){
                $rootScope.response = res.data;
            }
        });
    }
    $scope.datos();

    

    $scope.$watch('ctrl.cat.selected',function(res){
        var params_fil = {act:'all',filter:false};
        if(res.id){
            params_fil = {act:'filter',filter:res.id};
        }
        ResourceMedia.get(params_fil,function(res){
            $scope.response = res.data;
        });
    });

    $scope.delete_img = function(n){

        $scope.res = confirm("Está seguro de eliminar este Imagen");

        if($scope.res){
            ResourceMedia.delete({id:n},function(res){
                globalF.toastr_msj(res);
                if(res.status=='success'){
                    $scope.step.first = true;
                    $scope.step.second = false;
                    $scope.datos();
                }
            });
         }else{
            return false;
        }    
    };

    $scope.viewimg = function (n) {
        $scope.image_response = {};
        $rootScope.id_img = n;
        console.log(n);
        /*------*/
        ResourceMedia.get({act: 'once', id: n}, function (res) {
            globalF.toastr_msj(res);
            $scope.step.first = false;
            $scope.step.second = true;
            $scope.image_response = res.data
            
            $scope.image_response.id_categories = res.data.id_categories.id;
            console.log($scope.image_response.id_categories);
        });
    };

    $scope.update_img = function(){
        ResourceMedia.save({
            id:$rootScope.id_img,name:$scope.image_response.name,
            id_categories:$scope.image_response.id_categories,
            id_user:$rootScope.session.data_session.data.id,
        },function(res){
            globalF.toastr_msj(res);
            if(res.status=='success'){
                $scope.closeThisDialog(0);
                $scope.datos();
            }
        });
    };

    $scope.open_newimage = function () {
        console.log('aqui');
        ngDialog.open({
            template: client_url + '/views/modal/uploadImage.html',
            plain: false,
            width:'60%',
            showClose: false,
            controller: ['$scope','ResourceCategories','globalF','ResourceMedia','$rootScope',function($scope,ResourceCategories,globalF,ResourceMedia,$rootScope){
                $scope.idresponse = [];
                $scope.dzOptions = {
                    url : api_url+'/api/upload',
                    acceptedFiles : 'image/jpeg, images/jpg, image/png, application/pdf',
                    addRemoveLinks : true,
                    paramName : 'file',
                    maxFilesize : '5'
                };

                $scope.dzCallbacks = {
                    'success' : function(file,xhr){
                        console.log('SUCCESS');
                        console.log(xhr);
                        $scope.idresponse.push(xhr.id);

                    },
                    'complete':function(res){
                        console.log(res);
                    }
                }

                $scope.level = $rootScope.session.data_session.data.level;

                $scope.admin = function(){
                    if($scope.level != 'admin')
                        $scope.cat_user = $rootScope.session.data_session.data.categorie.id;
                    else
                        $scope.cat_user = 0;
                } 
                $scope.admin();  

                $scope.datos = function(){

                    if($scope.level == 'admin'){
                        params_fil = {act:'all',filter:false};
                    }else{
                        params_fil = {act:'filter',filter:$scope.cat_user};    
                    }

                    console.log(params_fil);
                    ResourceMedia.get(params_fil,function(res){
                        globalF.toastr_msj(res);
                        if(res.status=='success'){
                            $rootScope.response = res.data;
                        }
                    });
                }
                $scope.datos();
                
                ResourceCategories.get({act:'all'},function(res){
                    globalF.toastr_msj(res);
                    if(res.status=='success'){
                        $scope.response = res.data;
                    }
                });

                $rootScope.value = 'Guardar';
                $scope.type = function(item){
                    if(item == '1'){
                        $rootScope.value = 'Guardar';
                    }else if(item == '2'){
                        $rootScope.value = 'Enviar';
                    }
                };

                $scope.i = {};
                $scope.y = {};

                $scope.save = function(item){
                    console.log($scope.idresponse);

                    switch(item){
                        case 'Guardar':
                            console.log('img');
                            $scope.i.id_categories = $scope.cat_user;
                            $scope.i.id = $scope.idresponse;
                            $scope.i.id_user = $rootScope.session.data_session.data.id;
                            console.log($scope.i);

                            ResourceMedia.save($scope.i,function(res){
                                globalF.toastr_msj(res);
                                if(res.status=='success'){
                                    $scope.closeThisDialog(0);
                                    $scope.datos();
                                }
                            });  
                        break;
                        case 'Enviar':
                            console.log('YouTube');
                            $scope.y.id_categories = $scope.cat_user;
                            $scope.y.act = 'youtube';
                            $scope.y.id_usr = $rootScope.session.data_session.data.id;
                            console.log($scope.y);

                            ResourceMedia.post($scope.y,function(res){
                                globalF.toastr_msj(res);
                                if(res.status=='success'){
                                    $scope.closeThisDialog(0);
                                    $scope.datos();
                                }
                            });    
                        break;
                    } 
                };

            }]
        });
    };
});