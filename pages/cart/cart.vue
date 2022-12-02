<template>
	<view class="cart-container" v-if="cart.length > 0">
		<my-address></my-address>
		
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="cart-title-text">购物车</text>
		</view>
		
		<uni-swipe-action>
			<block v-for="(goods, index) in cart" :key="goods.goods_id">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :showRadio="true" @radio-change="radioChangeHandler" 
						:showNum="true" @num-change="numChangeHandler"/>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<my-settle></my-settle>
	</view>
	<view class="empty-cart" v-else>
		<text class="tip-text">空空如也</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#C00000'
						}
					}
				]
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			radioChangeHandler(goods) {
				this.updateGoodsState(goods)
			},
			numChangeHandler(goods) {
				this.updateGoodsCount(goods)
			},
			swipeItemClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart-container {
	padding-bottom: 50px;
}
.cart-title {
	height: 40px;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	
	.cart-title-text {
		margin-left: 10px;
		font-size: 14px;
	}
}
.empty-cart {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 150px;
	
	.tip-text {
		font-size: 12px;
		color: gray;
		margin-top: 15px;
	}
}
</style>
