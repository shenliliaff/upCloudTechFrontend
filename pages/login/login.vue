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
					<image src="@/static/images/weixinIcon.png" mode="heightFix"></image>登录管理单位设备
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="login-btn" @click="onTestLogin" type="primary">
					<image src="@/static/images/weixinIcon.png" mode="heightFix"></image>登录管理单位设备
				</button>
				<!-- #endif -->
			</view>
			<uni-popup ref="popusAuthorization" type="center" :maskClick="false">
			<view class="contentview">
			<view class="title">用户隐私提示</view>
			<view class="des" @tap="openPrivacyContract">
				感谢您使用本小程序，在使用前您应当阅读井同意当点击同意并继续时，
				<uni-link class="link">隐私保护指引</uni-link>
				即表示您已理解并同意该条款内容，该条款将对您产生法律约束力；如您不同意，将无法继续使用小程序相关功能。
			</view>
			<view class="btns">
			<button class="item reject" @click="exitMiniProgram">拒绝</button>
			<button id="agree-btn" class="item agree" open-type="agreePrivacyAuthorization"
			@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</view>
			</view>
			</uni-popup>
			<footer class="footer">本小程序提供单位内部(例如：学校、公共文化等)IoT设备等在线控制功能，用户账号由后台注册并提供，无法直接注册使用</footer>
		</view>
	</view>
</template>

<script>
	import globals from "@/static/config/index.js"
	export default {
		data() {
			return {
				code: '', // 登录code
				privacyContractName:'',
			}
		},
		onLoad(option){
			// #ifdef MP-WEIXIN
			wx.getPrivacySetting({
				success: res => {
				console.log("是否需要授权：", res.needAuthorization, "隐私协议的名称为：", res.privacyContractName)
				if (res.needAuthorization) {
					this.privacyContractName = res.privacyContractName;
					this.$refs.popusAuthorization.open();
				}
			},
				fail: () => {console.log('需要授权失败')},
				complete: () => {},
			})
			// #endif
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
					venue_id:globals.venueId,
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
			},
			// 打开隐私协议页面
			openPrivacyContract() {
				let that = this;
				wx.openPrivacyContract({
				fail: () => {
					that.$queue.showToast('遇到错误无法打开！');
				}
				})
			},
			// 拒绝隐私协议
			exitMiniProgram() {
				// 直接退出小程序
				wx.exitMiniProgram()
			},
			// 同意隐私协议
			handleAgreePrivacyAuthorization() {
				this.$refs.popusAuthorization.close();
			},
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
		
		//下方是隐私弹框的样式
		.privacy {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 9999999;
		display: flex;
		align-items: center;
		justify-content: center;
		}
		.contentview {
		width: 632rpx;
		padding: 48rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
		}
		.contentview .title {
		text-align: center;
		color: #333;
		font-weight: bold;
		font-size: 32rpx;
		}
		.contentview .des {
		font-size: 26rpx;
		color: #666;
		margin-top: 40rpx;
		text-align: justify;
		line-height: 1.6;
		}
		.contentview .des .link {
		color: #07c160;
		text-decoration: underline;
		text-align: center;
		}
		button::after {
		border: none;
		}
		.btns {
		margin-top: 48rpx;
		display: flex;
		}
		.btns .item {
		justify-content: space-between;
		width: 244rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16rpx;
		box-sizing: border-box;
		border: none;
		}
		.btns .reject {
		background: #f4f4f5;
		color: #909399;
		}
		.btns .agree {
		background: #07c160;
		color: #fff;
		}
		
		.footer {
		    position: absolute;
		    bottom: 3px;
		    width: 95%;
		    height: 10%; /* footer的高度 */
			font-style: italic;
			font-size: 14px;
		  }
	}
</style>
