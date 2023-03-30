<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">临时钥匙</view>
		</view>
		<view class="content-box" v-if="keys.length > 0">
			<view class="secretKey-item" v-for="(key, index) in keys" :key="index" @tap="pageToSecretKeyDetail(key)">
				<view class="key-info-box">
					<view class="name">
						{{key.owner + '的钥匙'}}
					</view>
					<view class="time">
						{{key.start_time + '~' + key.end_time}}
					</view>
				</view>
				<uni-icons type="forward" size="26"></uni-icons>
			</view>
		</view>
		<view class="nodata" v-else>
			暂无数据
		</view>
		<view class="addBtn" @tap="pageToAddSecretKey">
			<uni-icons type="plusempty" size="32"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: 0, // 设备id
				deviceName: '', // 设备名称
				loading: false, // 下拉刷新标识
				keys: []
			}
		},
		onShow(option) {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
			this.getSecretKeys()
		},
		// 下拉刷新页面
		onPullDownRefresh() {
			this.loading = true
			this.getSecretKeys()
		},
		methods: {
			// 获取秘钥列表
			getSecretKeys() {
				this.$request({
					url: '/up-device-key-info/get-device-key-info',
					method: 'get',
					data: {
						deviceSn: this.deviceId,
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.keys = res.data
							if (this.loading) {
								this.loading = false
								uni.stopPullDownRefresh()
							}
						} else {
							this.keys = []
						}
					} else {
						uni.showToast({
							title: res.msg
						})
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'error'
					})
				})
			},
			// 返回
			goBack() {
				uni.navigateTo({
					url: '/pages/deviceDetail/deviceDetail'
				})
			},
			// 跳转临时秘钥编辑页面
			pageToSecretKeyDetail(data) {
				uni.setStorageSync('keyData', data)
				uni.navigateTo({
					url: '/pages/secretKeyDetail/secretKeyDetail'
				})
			},
			// 跳转新增临时秘钥页面
			pageToAddSecretKey() {
				uni.navigateTo({
					url: '/pages/addSecretKey/addSecretKey'
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
			background: #f9f9f9;
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
			position: absolute;
			top: 200rpx;
			left: 42rpx;
			right: 44rpx;
			bottom: 40rpx;
			overflow-y: scroll;
			.secretKey-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 162rpx;
				background: #FFFFFF;
				box-shadow: 2rpx 8rpx 40rpx 0rpx rgba(241,241,241,0.8);
				border-radius: 30rpx;
				padding: 44rpx 40rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;
				.key-info-box {
					.name {
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
					}
					.time {
						font-size: 26rpx;
						font-weight: 400;
						color: #999999;
						margin-top: 16rpx;
					}
				}
			}
		}
		.nodata {
			margin: 100rpx auto;
			text-align: center;
			font-size: 32rpx;
			font-weight: 400;
			color: #999999;
		}
		.addBtn {
			width: 124rpx;
			height: 124rpx;
			background: #EC9154;
			border-radius: 50%;
			position: absolute;
			right: 62rpx;
			bottom: 100rpx;
			text-align: center;
			line-height: 124rpx;
			cursor: pointer;
			::v-deep .uniui-plusempty {
				color: #fff!important;
			} 
		}
	}
	
	::v-deep .uniui-forward {
		color: #999999!important;
	}
</style>
