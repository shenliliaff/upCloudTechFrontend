<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">设备名称</view>
		</view>
		<view class="content-box">
			<view class="person-info-box box">
				<view class="item-box">
					<input class="uni-input" type="text" maxlength="10" :value="deviceName" @input="deviceNameChange" focus placeholder="请填写设备名称" />
					<view class="length">
						{{deviceNameLength + '/10'}}
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<view class="cancel-btn" @tap="goBack">取消</view>
			<view class="btn" @tap="saveEdit">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceName: '', // 设备名称
				deviceId: '', // 设备id
				deviceNameLength: 0, // 名称长度
			}
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
		},
		methods: {
			// 输入设备名称
			deviceNameChange(e) {
				this.deviceName = e.detail.value
				this.deviceNameLength = this.deviceName.length
			},
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 保存设备编辑
			saveEdit() {
				this.$request({
					url: '/up-device-info/update-device-name-info',
					method: 'post',
					data: {
						deviceName: this.deviceName,
						deviceSn: this.deviceId
					}
				}).then(res => {
					if (res.code === 200) {
						uni.setStorageSync('deviceName', this.deviceName)
						uni.showToast({
							title: '编辑成功！'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'error'
						})
					}
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
			.box {
				.item-box {
					width: 702rpx;
					height: 112rpx;
					background: #FFFFFF;
					border-radius: 30rpx;
					position: relative;
					::v-deep .uni-input {
						height: 112rpx;
						line-height: 112rpx;
						padding-left: 40rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
					
					::v-deep .uni-input-placeholder {
						color: rgba(51, 51, 51, 0.5);
					}
					.length {
						position: absolute;
						top: 50%;
						right: 40rpx;
						transform: translateY(-50%);
						font-size: 26rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}
		}
		
		.btn-box {
			display: flex;
			justify-content: space-between;
			width: 100%;
			position: absolute;
			left: 50%;
			bottom: 82rpx;
			transform: translateX(-50%);
			box-sizing: border-box;
			padding: 0 40rpx;
			.btn {
				display: inline-block;
				width: 320rpx;
				height: 90rpx;
				background: linear-gradient(268deg, #6D6DFF 0%, #5E5EFF 100%);
				border-radius: 44rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				line-height: 90rpx;
			}
			.cancel-btn {
				display: inline-block;
				width: 320rpx;
				height: 90rpx;
				background: rgba(153, 153, 153, 0.2);
				border-radius: 44px;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				line-height: 90rpx;
			}
		}
	}
</style>
