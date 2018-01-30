'use strict';

var api_token_inside = {key:'leifer',token:'mendez'};
//var api_url = 'https://gentle-atoll-43633.herokuapp.com/';
var api_url = 'http://localhost:8000';
var client_url = 'http://localhost/app_academy/';
/*Push*/
Pusher.channel_auth_endpoint = api_url+'/pusher/auth';
var client_pusher = new Pusher('0bf52aafe912d390ffd7', {
  cluster: 'us2'
});

MYapp.factory('ResourceLogin',function($resource){
		return $resource(api_url+"/api/login",null,{
			login:{
				method:'POST',
				params: api_token_inside
			},
			logout:{
				method:'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourceUsers',function($resource){
		return $resource(api_url+"/api/user",null,{
			get:{
				method:'GET',
				params: api_token_inside
			},
			add:{
				method:'POST',
				params: api_token_inside
			},
			update:{
				method:'PUT',
				params: api_token_inside
			},
			delete:{
				method: 'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourcePassword',function($resource){
    return $resource(api_url+"/api/password",null,{
        change:{
            method:'POST',
            params: api_token_inside
        },

    });
})

MYapp.factory('ResourceCategories',function($resource){
		return $resource(api_url+"/api/categories",null,{
			get:{
				method:'GET',
				params: api_token_inside
			},
			add:{
				method:'POST',
				params: api_token_inside
			},
			update:{
				method:'PUT',
				params: api_token_inside
			},
			delete:{
				method:'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourceNotification',function($resource){
	return $resource(api_url+"/api/notification",null,{
		add:{
			method: 'POST',
			params: api_token_inside
		},
		get: {
			method: 'GET',
			params: api_token_inside
		}
	});
})

MYapp.factory('ResourceFCM',function($resource){
	return $resource(api_url+"/api/fcm",null,{
		get:{
			method: 'GET',
			params: api_token_inside
		}
	});
})

MYapp.factory('ResourceMedia',function($resource){
	return $resource(api_url+'/api/upload',null,{
		save:{
            method: "PUT",
            params: api_token_inside
		},
		post:{
			method: 'POST',
			params: api_token_inside
		},
		get:{
			method: 'GET',
			params: api_token_inside
		}
	});
})

MYapp.factory('ResourceItem',function($resource){
	return $resource(api_url+'/api/item',null,{
		post:{
			method: 'POST',
			params: api_token_inside
		},
		get:{
			method: 'GET',
			params: api_token_inside
		},
		put:{
			method: 'PUT',
			params: api_token_inside
		},
		delete:{
			method: 'DELETE',
			params: api_token_inside
		}
	});
})

MYapp.factory('ResourceProducts',function($resource){
		return $resource(api_url+"/api/product",null,{
			get:{
				method:'GET',
				params: api_token_inside
			},
			add:{
				method:'POST',
				params: api_token_inside
			},
			update:{
				method:'PUT',
				params: api_token_inside
			},
			remove:{
				method:'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourceTables',function($resource){
		return $resource(api_url+"/api/table",null,{
			get:{
				method:'GET',
				params: api_token_inside
			},
			add:{
				method:'POST',
				params: api_token_inside
			},
			update:{
				method:'PUT',
				params: api_token_inside
			},
			remove:{
				method:'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourceOrders',function($resource){
		return $resource(api_url+"/api/order",null,{
			get:{
				method:'GET',
				params: api_token_inside
			},
			add:{
				method:'POST',
				params: api_token_inside
			},
			update:{
				method:'PUT',
				params: api_token_inside
			},
			remove:{
				method:'DELETE',
				params: api_token_inside
			}
		});
})

MYapp.factory('ResourceReport',function($resource){
		return $resource(api_url+"/api/report",null,{
			get:{
				method:'GET',
				params: api_token_inside
			}
		});
})

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="over-loading"><div class="in text-center"><img src="assets/css/icons/ellipsis.svg" /></div></div>';
}])

.config(['ChartJsProvider', function (ChartJsProvider) {
	// Configure all charts
	ChartJsProvider.setOptions({
		chartColors: ['#2196F3', '#87f773'],
		responsive: true,
		height:200
	});
	// Configure all line charts
	ChartJsProvider.setOptions('line', {
		showLines: true
	});
}]);

