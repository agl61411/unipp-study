<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<text class="tips-text">登录后尽享更多权益</text>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
	data() {
		return {
			
		}
	},
	computed: {
		...mapState('m_user', ['redirectInfo'])
	},
	methods: {
		...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
		async getUserProfile(e) {
			const [err, success] = await uni.getUserProfile({ desc: '登录' })
			if (err && err.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！')
			this.updateUserInfo(success.userInfo)
			
			this.getToken(success)
		},
		async getToken(info) {
			const [error, res] = await uni.login().catch(error => error)
			if (error || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
			
			const query = {
				code: res.code,
				encryptedData: info.encryptedData,
				iv: info.iv,
				rawData: info.rawData,
				signature: info.signature
			}
			
			const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
			// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
			// uni.$showMsg('登录成功！')
			
			const result = {
				message: {
					token: 'Bearer asdhf78dt8fasdygfyu2i3786'
				}
			}
			
			this.updateToken(result.message.token)
			this.navigateBack()
		},
		navigateBack() {
			console.log(this.redirectInfo)
			if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
				uni.switchTab({
					url: this.redirectInfo.from,
					complete: () => {
						this.updateRedirectInfo(null)
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: '';
			display: block;
			width: 100%;
			height: 40px;
			background-color: #FFFFFF;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}
		
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
