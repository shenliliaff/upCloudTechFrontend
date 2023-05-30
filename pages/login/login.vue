<template>
	<view class="container">
		<view class="statusBar-box">
			<!-- <uni-icons type="back" size="30" @tap="goBack"></uni-icons> -->
			<view class="page-title">登录</view>
		</view>
		<view class="content-box">
			<view class="logo">
				<image src="@/static/images/loginLogo.png" mode="widthFix"></image>
			</view>
			<view class="login-title">
				<image src="@/static/images/tipBg.png" mode="heightFix"></image>
				<view class="title">
					欢迎使用向上云智联
				</view>
			</view>
			<view class="login-btn">
				<!-- #ifdef MP-WEIXIN -->
				<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber" type="primary">
					<image src="@/static/images/weixinIcon.png" mode="heightFix"></image>登录
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="login-btn" @click="onTestLogin" type="primary">
					<image src="@/static/images/weixinIcon.png" mode="heightFix"></image>登录
				</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import globals from "@/static/config/index.js"
	export default {
		data() {
			return {
				code: '', // 登录code
			}
		},
		onBackPress(options) {
		  // 触发返回就会调用此方法，这里实现的是禁用物理返回，顶部导航栏的自定义返回 uni.navigateBack 仍可使用
		  if (options.from == 'backbutton') {
		    return true;
		  } else if (options.from == 'navigateBack') {
		    return false;
		  }
		},
		methods: {
			// 获取手机号信息
			onGetPhoneNumber(e) {
				console.log(e)
				if(e.detail.errMsg === 'getPhoneNumber:ok') {
					this.loginHandler(e.detail.code)
				} else {
					console.log('getPhoneNumber:fail user deny')
				}
			},
			
			onTestLogin(){
				//临时测试登录
				const {token, phone, venue_id, venue_name} = {
					token:'S4IuNhknh49kPUo0G1O6xtoE4jM4TsAMZc5mEqDzRPMzChTQl46eFzz05lbE2krK',
					phone:'18301125620',
					venue_id:10001,
					venue_name:'彭山文化馆',
				}
				uni.setStorageSync('token', token)
				uni.setStorageSync('username', phone)
				uni.setStorageSync('venueId', venue_id)
				uni.setStorageSync('venueName', venue_name)
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			// 手机号登录
			loginHandler(code) {
				
				this.$request({
					url: '/up-user/wx/login',
					method: 'post',
					data: {
						code
					}
				}).then(res => {
					if (res.code === 200) {
						const {token, phone, venue_id, venue_name} = res.data
						uni.setStorageSync('token', token)
						uni.setStorageSync('username', phone)
						uni.setStorageSync('venueId', venue_id)
						uni.setStorageSync('venueName', venue_name)
						uni.navigateTo({
							url: '/pages/index/index'
						})
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'error'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		padding: 24rpx;
		box-sizing: border-box;
		background: #f9f9f9;
		padding: 90rpx 0 30rpx;
		position: relative;

		.statusBar-box {
			display: flex;
			align-items: center;
			position: relative;
			padding-left: 34rpx;

			.page-title {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				font-size: 36rpx;
				font-weight: 400;
				color: #333333;
			}
		}

		.content-box {
			margin-top: 50rpx;
			padding: 0 24rpx;

			.logo {
				text-align: center;
				margin: 230rpx auto 46rpx;

				image {
					width: 138rpx;
					height: 138rpx;
				}
			}

			.login-title {
				display: inline-block;
				position: relative;
				margin: 0 auto 158rpx;
				left: 50%;
				transform: translateX(-50%);

				.title {
					font-size: 48rpx;
					font-weight: 500;
					color: #030303;
				}

				image {
					width: 292rpx;
					height: 12rpx;
					position: absolute;
					bottom: -4rpx;
					left: 0;
				}
			}
			
			.phone-box {
				padding: 0 40rpx;
				margin-bottom: 30rpx;
				.uni-input {
					height: 80rpx;
					border: 1px solid #000;
					border-radius: 20rpx;
					padding-left: 30rpx;
				}
			}
		}

		button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 630rpx;
			height: 96rpx;
			background: linear-gradient(92deg, #7975FE 0%, #5C5AFB 100%);
			border-radius: 48rpx;

			image {
				width: 52rpx;
				height: 42rpx;
				margin-right: 19rpx;
			}
		}
	}
</style>
