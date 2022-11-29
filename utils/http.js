import { $http } from '@escook/request-miniprogram'

uni.$http = $http

$http.baseUrl = 'https://www.uinav.com'

$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
}

$http.afterRequest = function(options) {
	uni.hideLoading()
}