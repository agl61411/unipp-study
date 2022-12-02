<template>
	<view>
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="swiper in swiperList" :key="swiper.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + swiper.goods_id">
					<image :src="swiper.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<view class="nav-list">
			<view class="nav-item" v-for="(nav, index) in navList" :key="index" @click="handleNav(nav)">
				<image :src="nav.image_src" ></image>
			</view>
		</view>
		
		<view class="floor-list">
			<view class="floor-item" v-for="(floor, index) in floorList " :key="index">
				<image :src="floor.floor_title.image_src" class="floor-title"></image>
				<view class="floor-img-box">
					<navigator class="left-img-box" :url="floor.product_list[0].url">
						<image :src="floor.product_list[0].image_src" :style="{width: floor.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item, i) in floor.product_list" :key="i" v-if="i !== 0" :url="item.url">
							<image :src="item.image_src" :style="{width: item.image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				swiperList: [],
				navList: [],
				floorList: []
			}
		},
		methods: {
			async getSwiperList() {
				const { data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')

				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
			},
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')

				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			async getFloorList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
			
				if (res.meta.status !== 200) return uni.$showMsg()
				
				res.message.forEach(floor => {
					floor.product_list.forEach(item => {
						item.url = '/subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
					})
				})
					
				this.floorList = res.message
			},
			handleNav(nav) {
				if (nav.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 10;
}

swiper {
	height: 330rpx;
	.swiper-item, image {
		width: 100%;
		height: 100%;
	}
}

.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 30rpx 0;
	
	.nav-item, image {
		width: 128rpx;
		height: 140rpx;
	}
}

.floor-title {
	height: 60rpx;
	width: 100%;
	display: flex;
}

.floor-img-box {
	display: flex;
	padding-left: 10rpx;
	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
}
</style>
