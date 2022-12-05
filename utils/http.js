import { $http } from '@escook/request-miniprogram'
import store from '../store/store.js'

uni.$http = $http

$http.baseUrl = 'https://www.uinav.com'

$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
	
	if (options.url.indexof('/my/') !== -1) {
		options.header = {
			Authorization: store.state.m_user.token
		}
	}
}

$http.afterRequest = function(options) {
	uni.hideLoading()
}