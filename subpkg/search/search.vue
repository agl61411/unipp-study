<template>
	<view>
		<view class="search-box">
			<uni-search-bar cancelButton="none" radius="18" @confirm="search" @input="input" ></uni-search-bar>
		</view>
		
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(result, index) in searchResults" :key="result.goods_id" @click="gotoDetail(result)">
				<view class="goods-name">{{result.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<view class="history-list">
				<uni-tag v-for="(history, index) in histories" :key="index" :text="history" @click="gotoGoodsList(history)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				keyword: '',
				searchResults: [],
				historyList: []
			};
		},
		computed: {
			histories() {
				return [...this.historyList].reverse()
			}
		},
		methods: {
			search() {},
			input(val) {
				clearTimeout(this.timer)
				
				this.timer = setTimeout(() => {
					this.keyword = val
					this.getSearchResults()
				}, 500)
			},
			async getSearchResults() {
				if (this.keyword.length === 0) {
					this.searchResults = []
					return
				}
				
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.keyword })
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				
				this.saveSearchHistory()
			},
			saveSearchHistory() {
				const list = new Set(this.historyList)
				list.delete(this.keyword)
				list.add(this.keyword)
				
				this.historyList = Array.from(list)
				
				// 持久化处理
				uni.setStorageSync('keyword', JSON.stringify(this.historyList))
			},
			gotoDetail(result) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + result.goods_id
				})
			},
			gotoGoodsList(history) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + history
				})
			},
			clean() {
				this.historyList = []
				uni.setStorageSync('keyword', '[]')
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('keyword') || '[]')
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}

.sugg-list {
	padding: 0 5px;
	
	.sugg-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}

.history-box {
	padding: 0 5px;
	
	.history-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list {
		display: flex;
		flex-wrap: wrap;
		
		uni-tag {
			margin: 5px 5px 0 0;
		}
	}
}
</style>
