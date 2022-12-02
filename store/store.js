import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import moduleCart from './cart.js'
import moduleUser from './user.js'

const store = new Vuex.Store({
	modules: {
		'm_cart': moduleCart,
		'm_user': moduleUser
	}
})

export default store