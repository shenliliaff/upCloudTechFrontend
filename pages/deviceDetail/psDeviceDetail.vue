<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">
				{{ pageTitle }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: 0,
				deviceName: '', // 设备名称
				locationName: '', // 设备所处教室
				locationId: '', // 教室id
				pageTitle: '舞蹈教室的电子门禁',
			}
		},
		onLoad(option) {
			this.locationId = option.locationId
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
			this.getDeviceDetailInfo()
		},
		methods: {
			// 获取设备详情
			getDeviceDetailInfo() {
				console.log("获取设备详情")
			},
			// 返回
			goBack() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
		}
	}
</script>


<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		padding: 24rpx;
		background: url('https://upcloudtech.cn/resource/lockedBg.png') no-repeat;
		background-size: 100%;
		box-sizing: border-box;
		padding: 110rpx 0 225rpx;
		position: relative;

		.statusBar-box {
			display: flex;
			align-items: center;
			position: relative;
			padding-left: 24rpx;

			.page-title {
				width: 80%;
				text-align: center;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				font-size: 36rpx;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
	}

	::v-deep .uniui-back {
		color: #fff !important;
	}
</style>
