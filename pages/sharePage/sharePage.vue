<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
		</view>
		<view class="content-box">
			<view class="qrcode-box">
				<uqrcode ref="uqrcode" canvas-id="qrcode" :value="qrcodeUrl"
					:options="{ size: 326, sizeUnit: 'rpx' }" :size="326" sizeUnit="rpx"></uqrcode>
			</view>
			<view class="box">
				{{secretKeyName}}
			</view>
			<view class="department-box">
				{{departmentName}}
			</view>
			<view class="time">
				{{time}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceKeyId: '', // 密钥id
				//modifier: '', // 密钥创建人
				keyOwer:'',// 密钥拥有者
				qrcodeUrl: '',
				secretKeyName: '舞蹈教室的电子门禁', // 秘钥名称
				departmentName: '物联控制总部', // 部门名称
				time: '2021-07-12 15:00~2022-07-12 15:00'
			}
		},
		onLoad(option) {
			//this.modifier = option.modifier
			this.keyOwer = uni.getStorageSync('username')
			this.deviceKeyId = option.deviceKeyId
			this.qrcodeUrl = this.deviceKeyId + '-' + this.keyOwer + '-up'
			this.getShareInfo()
		},
		methods: {
			// 获取二维码页面信息
			getShareInfo() {
				this.$request({
					url: '/up-device-key-info/get-device-key-share-info',
					method: 'get',
					data: {
						//modifier: this.modifier,
						deviceKeyId: this.deviceKeyId
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							let d = res.data[0]
							this.secretKeyName = d.location_name + '的' + d.device_name
							this.departmentName = d.venue_name
							this.keyOwer = d.phone
							let sTime = d.start_time
							let eTime = d.end_time
							this.time = sTime[0] + '-' + sTime[1] + '-' + sTime[2] + ' ' + sTime[3] + ':' + sTime[4] + ':' + sTime[5] + '~' + eTime[0] + '-' + eTime[1] + '-' + eTime[2] + ' ' + eTime[3] + ':' + eTime[4] + ':' + eTime[5]
						}
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'error'
					})
				})
			},
			goBack() {
				uni.navigateTo({
					url: '/pages/login/login'
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
		padding: 110rpx 45rpx 30rpx;
		position: relative;
		.statusBar-box {
			display: flex;
			align-items: center;
			position: relative;
			padding-left: 34rpx;
		}

		.content-box {
			background: #FFFFFF;
			box-shadow: 2rpx 8rpx 40rpx 0px rgba(241, 241, 241, 0.8);
			border-radius: 30rpx;
			padding: 100rpx 0 140rpx;
			box-sizing: border-box;
			font-weight: 500;
			text-align: center;
			color: #333333;
			margin-top: 150rpx;
			font-size: 32rpx;
			.qrcode-box {
				width: 326rpx;
				height: 326rpx;
				margin: 0 auto 62rpx;
			}

			.box {
				font-size: 36rpx;
				margin-bottom: 29rpx;
			}
			.department-box {
				color: #999999;
			}
			.time {
				margin-top: 100rpx;
			}
		}
	}
</style>
