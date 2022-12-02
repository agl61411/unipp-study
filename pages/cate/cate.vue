<template>
	<view>
		<my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(cate, index) in cateList" :key="cate.cat_id">
					<view class="left-scroll-view-item" :class="{active: active === index}" @click="activeChange(cate, index)">{{cate.cat_name}}</view>
				</block>
			</scroll-view>
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="rightscTop">
				<view class="cate-lv2" v-for="(cate2, index) in cateLevel2" :key="cate2.cat_id">
					<view class="cate-lv2-title">/{{cate2.cat_name}}/</view>
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(cate3, index) in cate2.children" :key="cate3.cat_id" @click="gotoGoodList(cate3)">
							<image :src="cate3.cat_icon.replace('dev', 'web')" ></image>
							<text>{{cate3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		mixins: [badgeMix],
		data() {
			return {
				wh: 0,
				cateList: [],
				cateLevel2: [],
				active: 0,
				rightscTop: 0
			};
		},
		methods: {
			async getCateList() {
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200)  return uni.$showMsg()
				this.cateList = res.message
				this.cateLevel2 = this.cateList[0].children
			},
			activeChange(cate, index) {
				this.cateLevel2 = cate.children
				this.active = index
				this.rightscTop = this.rightscTop === 0 ? 1 : 0
			},
			gotoGoodList(cate3) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${cate3.cat_id}`
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			
			this.getCateList()
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	
	.left-scroll-view {
		width: 120px;
		
		.left-scroll-view-item {
			background-color: #F7F7F7;
			line-height: 60px;
			text-align: center;
			font-size: 12px;
			
			&.active {
				position: relative;
				background-color: #FFFFFF;
				
				&::before {
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
	}

	.cate-lv2 {
		&-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}
		
		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;
			
			.cate-lv3-item {
				width: 33.33%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 10px;
				
				image {
					width: 60px;
					height: 60px;
				}
				text {
					font-size: 12px;
				}
			}
		}
	}
}
</style>
