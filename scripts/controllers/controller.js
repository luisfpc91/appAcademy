'use strict';

MYapp.factory('globalF', function (toastr, $cookies, $location, $rootScope, webNotification) {
    return {
        toastr_msj: function (res) {
            if (res.status == 'success') {
                if (res.msj)
                    toastr.success(res.msj);
                return res;
            } else if (res.status == 'wait') {
                if (res.msj)
                    toastr.info(res.msj);
                return res;
            } else if (res.status == 'fail') {
                if (res.msj)
                    toastr.error(res.msj);
                return res;
            }
        },
        clear_cookie: function () {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            $rootScope.session = false;
            $location.path("/");
        },
        validate_session: function () {
            var api_token = {};
            var ck_session = $cookies.get('session');
            if (ck_session) {
                ck_session = JSON.parse(ck_session);
                $rootScope.session = {
                    login: true,
                    data_session: ck_session
                }
                if(ck_session.data!==undefined){
                    api_token.key = ck_session.data.key;
                    api_token.token = ck_session.data.token;
                    return ck_session;
                }else{
                    $rootScope.session = {
                        login: false,
                        data_session: null
                    }
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    $location.path("/")
                }

            } else {
                $rootScope.session = {
                    login: false,
                    data_session: null
                }
                var cookies = $cookies.getAll();
                angular.forEach(cookies, function (v, k) {
                    $cookies.remove(k);
                });
                $location.path("/")
            }
        },
        pagination: function (res) {
            $rootScope.pagination = {
                'last_page': res.data.last_page,
                'paginates_array': [],
                'current': res.data.current_page
            };
            for (var i = 1; i <= $rootScope.pagination.last_page; i++) {
                $rootScope.pagination.paginates_array.push({
                    num: i,
                    link: res.data.path + '?page=' + i
                });
            }
        },
        notificationD: function (noti) {
            webNotification.showNotification(noti.notificationTitle, {
                body: noti.notificationText,
                onClick: function onNotificationClicked() {
                    console.log('Notification clicked.');
                },
                autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Unable to show notification: ' + error.message);
                } else {
                    console.log('Notification Shown.');

                    setTimeout(function hideNotification() {
                        console.log('Hiding notification....');
                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 5000);
                }
            });
        }        
    };
})
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    })
    
    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    })

    .directive("fileinput", [function () {
        return {
            scope: {
                fileinput: "=",
                filepreview: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.fileinput = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.filepreview = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(scope.fileinput);
                });
            }
        }
    }])

MYapp.directive('myDirective', function (httpPostFactory) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('change', function () {
                var formData = new FormData();
                formData.append('file', element[0].files[0]);

                // optional front-end logging
                var fileObject = element[0].files[0];
                scope.fileLog = {
                    'lastModified': fileObject.lastModified,
                    'lastModifiedDate': fileObject.lastModifiedDate,
                    'name': fileObject.name,
                    'size': fileObject.size,
                    'type': fileObject.type
                };
                scope.$apply();

                /*  ---> post request to your php file and use $_FILES in your php file   < ----
                httpPostFactory('your_upload_image_php_file.php', formData, function (callback) {
                    console.log(callback);
                });
                */
            });

        }
    };
})

MYapp.factory('httpPostFactory', function ($http) {
    return function (file, data, callback) {
        $http({
            url: file,
            method: "POST",
            data: data,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (response) {
            callback(response);
        });
    };
})
    .controller('LoginCtrl', function ($scope, ResourceLogin, globalF, $cookies, $location, $rootScope) {
        $rootScope.current_page = {}, $scope.logindata = {};
        var ck_session = globalF.validate_session();
        if (ck_session) {
            $location.path('/home');
        } else {
            $rootScope.session = {
                login: false,
                data_session: null
            }
        }
        $rootScope.current_page = 'login';
        $scope.login = function () {
            ResourceLogin.login($scope.logindata, function (res) {
                globalF.toastr_msj(res);
                if (res.status == 'success') {
                    if(res.data.level != "user"){
                        console.log(res);
                        var obj_session = JSON.stringify(res);
                        var api_token = {};
                        api_token.key = res.data.key;
                        api_token.token = res.data.token;
                        console.log(api_token);
                        $cookies.put('session', obj_session);
                        $rootScope.session.login = true;
                        $rootScope.session.data_session = res;
                        $location.path("/home");
                    }else{  
                        ResourceLogin.logout(true, function (res) {
                            globalF.clear_cookie();
                            $rootScope.notifications = [];
                        });
                    }
                }
            });
        }
    })

    .controller('IndexProductCtrl', function ($scope, ResourceProducts, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $rootScope.current_page = 'product';
        ResourceProducts.get(null, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
        });

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceProducts.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }

        $scope.open_modal = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_product = id;
            } else {
                $rootScope.id_product = null;
            }
            ngDialog.open({
                template: client_url + '/views/modal/createProductModal.html',
                plain: false,
                showClose: false,
                controller: 'ProductCtrl'
            });
        }

        $scope.open_delete = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_product = id;
            } else {
                $rootScope.id_product = null;
            }
            ngDialog.open({
                template: client_url + '/views/modal/removeProductModal.html',
                plain: false,
                showClose: false,
                controller: 'ProductCtrl'
            });
        }
    })

    .controller('ProductCtrl', function ($scope, ResourceProducts, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $scope.newproduct = {};
        if ($rootScope.id_product) {
            console.log($rootScope.id_product);
            $scope.newproduct.id_product = $rootScope.id_product;
            ResourceProducts.get($scope.newproduct, function (res) {
                $scope.newproduct.name = res.data.name;
                $scope.newproduct.stock = res.data.stock;
                $scope.newproduct.price = res.data.price;
                $scope.newproduct.observation = res.data.observation;
                $scope.newproduct.status = res.data.status;
                $scope.newproduct.type = res.data.type;
            });
        }
        $scope.create = function () {
            if ($rootScope.id_product) {
                $scope.newproduct.id_product = $rootScope.id_product;
                ResourceProducts.update($scope.newproduct, function (res) {
                    globalF.toastr_msj(res);
                    console.log(res);
                    if (res.status == 'success') {
                        ResourceProducts.get(null, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                        });
                        $scope.closeThisDialog(0);
                    }
                })
            } else {
                ResourceProducts.add($scope.newproduct, function (res) {
                    globalF.toastr_msj(res);
                    console.log(res);
                    if (res.status == 'success') {
                        ResourceProducts.get(null, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                        });
                        $scope.closeThisDialog(0);
                    }
                })
            }

        }

        $scope.remove = function () {
            ResourceProducts.remove({'id_product': $rootScope.id_product}, function (res) {
                globalF.toastr_msj(res);
                if (res.status == 'success') {
                    ResourceProducts.get(null, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                    });
                    $scope.closeThisDialog(0);
                }
            });
        }
    })
    
    .controller('IndexTablesCtrl', function ($scope, ResourceTables, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $rootScope.current_page = 'table';
        ResourceTables.get(null, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
        });

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceTables.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }

        $scope.open_modal = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_table = id;
            } else {
                $rootScope.id_table = null;
            }
            ngDialog.open({
                template: client_url + '/views/modal/createTableModal.html',
                plain: false,
                showClose: false,
                controller: 'TableCtrl'
            });
        }

        $scope.open_delete = function (id) {
            console.log(id);
            if (id) {
                $rootScope.id_table = id;
            } else {
                $rootScope.id_table = null;
            }
            ngDialog.open({
                template: client_url + '/views/modal/removeProductModal.html',
                plain: false,
                showClose: false,
                controller: 'TableCtrl'
            });
        }
    })
    
    .controller('TableCtrl', function ($scope, ResourceTables, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $scope.newtable = {};
        if ($rootScope.id_table) {
            console.log($rootScope.id_table);
            $scope.newtable.id_table = $rootScope.id_table;
            ResourceTables.get($scope.newtable, function (res) {
                $scope.newtable.nickname = res.data.nickname;
                $scope.newtable.observation = res.data.observation;
                $scope.newtable.status = res.data.status;
            });
        }
        $scope.create = function () {
            if ($rootScope.id_table) {
                $scope.newtable.id_table = $rootScope.id_table;
                ResourceTables.update($scope.newtable, function (res) {
                    globalF.toastr_msj(res);
                    console.log(res);
                    if (res.status == 'success') {
                        ResourceTables.get(null, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                        });
                        $scope.closeThisDialog(0);
                    }
                })
            } else {
                ResourceTables.add($scope.newtable, function (res) {
                    globalF.toastr_msj(res);
                    console.log(res);
                    if (res.status == 'success') {
                        ResourceTables.get(null, function (res) {
                            globalF.toastr_msj(res);
                            globalF.pagination(res);
                            $rootScope.response = res;
                        });
                        $scope.closeThisDialog(0);
                    }
                })
            }

        }

        $scope.remove = function () {
            ResourceTables.remove({'id_table': $rootScope.id_table}, function (res) {
                globalF.toastr_msj(res);
                if (res.status == 'success') {
                    ResourceTables.get(null, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                    });
                    $scope.closeThisDialog(0);
                }
            });
        }
    })

    .controller('IndexOrdersCtrl', function ($scope, ResourceTables, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $rootScope.current_page = 'orders';
        ResourceTables.get({id_host: $rootScope.session.data_session.data.id}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;

            console.log(res);
        });


        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceTables.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }
    })
    
    .controller('IndexOrdersSingleCtrl', function ($scope, ResourceTables, ResourceOrders, globalF, $cookies, $location, $rootScope, ngDialog, $routeParams) {
        globalF.validate_session();
        $rootScope.current_page = 'order';
        $rootScope.id_ready = {};
        $rootScope.total_order = 0;
        $rootScope.id_table = $routeParams.id;
        ResourceOrders.get({'id_table': $routeParams.id}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
            $rootScope.total_order = res.total;
        });

        $scope.open_ready = function (id) {
            $rootScope.id_ready = id;
            ngDialog.open({
                template: client_url + '/views/modal/readyOrder.html',
                plain: false,
                showClose: false,
                controller: ['$scope', 'ResourceOrders', '$rootScope', 'globalF', '$routeParams', function ($scope, ResourceOrders, $rootScope, globalF, $routeParams) {
                    $scope.ready = function () {
                        ResourceOrders.update({
                            id_table: $rootScope.id_table,
                            ready: $rootScope.id_ready
                        }, function (res) {
                            globalF.toastr_msj(res);
                            if (res.status == 'success') {
                                ResourceOrders.get({'id_table': $routeParams.id}, function (res) {
                                    globalF.toastr_msj(res);
                                    globalF.pagination(res);
                                    $rootScope.response = res;
                                    $scope.closeThisDialog(0);
                                });
                            }
                        });
                    }
                }]
            });
        }

        $scope.open_close = function () {
            $rootScope.id_table = $routeParams.id;
            ngDialog.open({
                template: client_url + '/views/modal/closeOrder.html',
                plain: false,
                showClose: false,
                controller: ['$scope', 'ResourceOrders', '$rootScope', 'globalF', function ($scope, ResourceOrders, $rootScope, globalF) {
                    $scope.newbill = {};
                    ResourceOrders.get({id_table: $rootScope.id_table, withoutpaginate: true}, function (res) {
                        var i;
                        var total = 0;
                        for (i in res.data) {
                            total += res.data[i].price;
                        }

                        $scope.total = total;
                    });

                    $scope.close = function () {
                        ResourceOrders.remove({
                            id_table: $rootScope.id_table,
                            name_bill: $scope.newbill.name_bill,
                            pay_method: $scope.newbill.pay_method,
                            id_host: $rootScope.session.data_session.data.id
                        }, function (res) {
                            globalF.toastr_msj(res);
                            if (res.status == 'success') {
                                ResourceOrders.get({'id_table': $rootScope.id_table}, function (res) {
                                    globalF.toastr_msj(res);
                                    globalF.pagination(res);
                                    $rootScope.response = res;
                                    $rootScope.total_order = 0;
                                });
                                $scope.closeThisDialog(0);
                            }
                        });
                    }
                }]
            });
        }
        $scope.next_page = function (num) {
            var param = {
                page: num,
                id_table: $rootScope.id_table
            }
            ResourceOrders.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }

        $scope.open_modal = function () {
            ngDialog.open({
                template: client_url + '/views/modal/createOrderModal.html',
                plain: false,
                showClose: false,
                controller: 'OrderCtrl'
            });
        }

        $scope.open_delete = function (id) {
            $rootScope.id_product = id;
            ngDialog.open({
                template: client_url + '/views/modal/removeOrderModal.html',
                plain: false,
                showClose: false,
                controller: 'OrderCtrl'
            });
        }
    })
    
    .controller('OrderCtrl', function ($scope, ResourceProducts, ResourceTables, ResourceOrders, globalF, $cookies, $location, $rootScope, ngDialog, $routeParams) {
        globalF.validate_session();
        $scope.neworder = {};
        $scope.refresProduct = function (src) {
            ResourceProducts.get({'withoutpaginate': true, 'src': src}, function (res) {
                $scope.dataproducts = res;
            });
        };
        $scope.priceTotal = function (data) {
            var total = 0;

            if (data.product !== undefined) {
                total = (data.product.price) * (data.quantity);
            }
            return total;
        }
        /*------------------------------*/
        ResourceTables.get({'withoutpaginate': true}, function (res) {
            $scope.datatable = res;
        });
        if ($rootScope.id_order) {
            $scope.neworder.id_order = $rootScope.id_order;
            ResourceTables.get($scope.neworder, function (res) {
                $scope.neworder.nickname = res.data.nickname;
                $scope.neworder.observation = res.data.observation;
                $scope.neworder.status = res.data.status;
            });
        }
        $scope.create = function () {
            $scope.neworder.id_table = $rootScope.id_table;
            $scope.neworder.id_product = $scope.neworder.product.id;
            $scope.neworder.id_host = $rootScope.session.data_session.data.id;
            ResourceOrders.add($scope.neworder, function (res) {
                globalF.toastr_msj(res);
                if (res.status == 'success') {
                    ResourceOrders.get({'id_table': $routeParams.id}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $rootScope.total_order = res.total;
                    });
                    $scope.closeThisDialog(0);
                }
            })

        }

        $scope.remove = function () {
            ResourceOrders.update({
                'id_table': $rootScope.id_table,
                'id_product': $rootScope.id_product,
                'id_host': $rootScope.session.data_session.data.id,
            }, function (res) {
                globalF.toastr_msj(res);
                if (res.status == 'success') {
                    ResourceOrders.get({'id_table': $routeParams.id}, function (res) {
                        globalF.toastr_msj(res);
                        globalF.pagination(res);
                        $rootScope.response = res;
                        $rootScope.total_order = 0;
                    });
                    $scope.closeThisDialog(0);
                }
            });
        }
    })
    
    .controller('IndexReportCtrl', function ($scope, ResourceReport, globalF, $cookies, $location, $rootScope, ngDialog) {
        globalF.validate_session();
        $rootScope.current_page = 'report';
        $rootScope.chart = {};
        $scope.chart_w = $('#report-chart').width();
        $scope.datasetOverride = {
            backgroundColor: "rgba( 0,203,254,0.7)"
        };
        var data_in = [];
        $rootScope.chart.labels = [];
        $rootScope.chart.series = ['Entradas'];
        $rootScope.chart.data = [data_in];
        ResourceReport.get(null, function (res) {
            var i;
            for (i in res.chart) {
                $rootScope.chart.labels.push(res.chart[i].letter);
                data_in.push(res.chart[i].amount);
            }
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
        });

        $scope.open_filter = function () {
            ngDialog.open({
                template: client_url + '/views/modal/filterModal.html',
                showClose: false,
                plain: false,
                controller: 'ReportCtrl'
            });
        }

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceReport.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }
    })
    
    .controller('ReportCtrl', function ($scope, ResourceUsers, ResourceReport, globalF, $cookies, $location, $rootScope) {
        globalF.validate_session();
        $scope.filter = {user: {id: null}};
        ResourceUsers.get({withoutpaginate: true}, function (res) {
            $scope.filter.users = res.data;

        });
        $scope.filterdata = function () {

            ResourceReport.get({
                start_range: $scope.filter.start_range,
                finish_range: $scope.filter.finish_range,
                id_host: $scope.filter.user.id,
                src: $scope.filter.src,
            }, function (res) {
                console.log(res);
                if (res.status == 'success') {
                    var data_in = [];
                    $rootScope.chart.labels = [];
                    $rootScope.chart.series = ['Entradas'];
                    $rootScope.chart.data = [data_in];

                }
                var i;
                for (i in res.chart) {
                    $rootScope.chart.labels.push(res.chart[i].letter);
                    data_in.push(res.chart[i].amount);
                }
                globalF.toastr_msj(res);
                globalF.pagination(res);
                $rootScope.response = res;
                $scope.closeThisDialog(0);
            });
        }
    })
    
    .controller('IndexPanelCtrl', function ($scope, ResourceUsers, ResourceOrders, globalF, $cookies, $location, $rootScope, ngDialog, toastr) {
        globalF.validate_session();
        $rootScope.current_page = 'panel';
        ResourceOrders.get({id_order: 'ALL', type: $rootScope.session.data_session.data.level}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
            $rootScope.total_order = res.total;
        });

        $scope.open_ready = function (id, id_table) {
            console.log(id_table);
            $rootScope.id_table = id_table;
            $rootScope.id_ready = id;
            ngDialog.open({
                template: client_url + '/views/modal/readyOrder.html',
                plain: false,
                showClose: false,
                controller: ['$scope', 'ResourceOrders', '$rootScope', 'globalF', '$routeParams', function ($scope, ResourceOrders, $rootScope, globalF, $routeParams) {
                    $scope.ready = function () {
                        ResourceOrders.update({
                            id_table: $rootScope.id_table,
                            ready: $rootScope.id_ready
                        }, function (res) {
                            globalF.toastr_msj(res);
                            if (res.status == 'success') {
                                ResourceOrders.get({
                                    id_order: 'ALL',
                                    type: $rootScope.session.data_session.data.level
                                }, function (res) {
                                    globalF.toastr_msj(res);
                                    globalF.pagination(res);
                                    $rootScope.response = res;
                                    $scope.closeThisDialog(0);
                                });
                            }
                        });
                    }
                }]
            });
        }
        $scope.next_page = function (num) {
            var param = {
                page: num
            }
            ResourceReport.get(param, function (res) {
                $rootScope.response = res;
                globalF.pagination(res);
            });
        }
    })
    
    .controller('PanelCtrl', function ($pusher, $scope, ResourceUsers, ResourceOrders, globalF, $cookies, $location, $rootScope) {
        globalF.validate_session();
        ResourceOrders.get({id_order: 'ALL', id_host: $rootScope.session.data_session.data.id}, function (res) {
            globalF.toastr_msj(res);
            globalF.pagination(res);
            $rootScope.response = res;
            $rootScope.total_order = res.total;
        });

        $scope.view = function (n) {
            ngDialog.open({
                template: client_url + '/views/modal/closeOrderModal.html',
                showClose: false,
                plain: false,
                controller: 'ReportCtrl'
            });
        }
    })
    
    .controller('mainCtrl', function ($pusher, $scope, ResourceOrders, ResourceTables, ResourceLogin, globalF, $cookies, $location, $rootScope) {
        $rootScope.notifications = [];
        var desktop = {};

        function trigger(data) {
            data.view = false;
            $rootScope.notifications.push(data);
            desktop.notificationTitle = data.name;
            if (data.observation) {
                desktop.notificationText = data.observation;
            } else {
                desktop.notificationText = '';
            }
            globalF.notificationD(desktop);
        }

        var pusher = $pusher(client_pusher);
        pusher.subscribe('main-channel');
        pusher.bind('notification',
            function (data_res) {
                console.log($rootScope.session.data_session);
                console.log(data_res);
                console.log($rootScope.session.data_session.data.level);
                console.log($rootScope.session.data_session);
                if ($rootScope.session.data_session.data.id_user == data_res.id_user) {
                    var p;
                    for (p in data_res.page) {
                        if (data_res.page[p] == $rootScope.current_page) {
                            ResourceTables.get({id_host: $rootScope.session.data_session.data.id}, function (res) {
                                globalF.toastr_msj(res);
                                globalF.pagination(res);
                                $rootScope.response = res;
                            });
                        }
                    }
                    /*------------------------*/
                    if (data_res.type_notification == 'payment') {//payment
                        console.log(1);
                        if ($rootScope.session.data_session.data.level == 'payment') {//payment
                            console.log(8);
                            if ($rootScope.session.data_session.data.id != data_res.id_host) {//
                                console.log(9);
                                trigger(data_res);
                            }
                        }

                    }
                    if (data_res.type_notification == 'cook') {//payment
                        console.log(2);
                        if ($rootScope.session.data_session.data.level == 'cook') {//payment
                            trigger(data_res);
                            ResourceOrders.get({id_order: 'ALL', type: data_res.type_notification}, function (res) {
                                globalF.toastr_msj(res);
                                globalF.pagination(res);
                                $rootScope.response = res;
                                $rootScope.total_order = res.total;
                            });
                        }

                    }
                    if (data_res.type_notification == 'bar') {//payment
                        console.log(3);
                        if ($rootScope.session.data_session.data.level == 'bar') {//payment
                            trigger(data_res);
                            ResourceOrders.get({id_order: 'ALL', type: data_res.type_notification}, function (res) {
                                globalF.toastr_msj(res);
                                globalF.pagination(res);
                                $rootScope.response = res;
                                $rootScope.total_order = res.total;
                            });
                        }

                    }
                    if (data_res.type_notification == 'host') {//payment
                        console.log(4);
                        if ($rootScope.session.data_session.data.level == 'host') {//payment
                            if ($rootScope.session.data_session.data.id == data_res.id_host) {//
                                trigger(data_res);
                            }
                        }

                    }
                }

                /*------------------------*/

            }
        );
        $scope.viewnotification = function () {
            var i;
            for (i in $rootScope.notifications) {
                $rootScope.notifications[i].view = true;
            }
        }
        $scope.logout = function () {
            ResourceLogin.logout(true, function (res) {
                globalF.clear_cookie();
                $rootScope.notifications = [];
            });
        }
    });