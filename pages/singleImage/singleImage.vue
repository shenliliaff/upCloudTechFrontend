<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">
				{{ pageTitle }}
			</view>
		</view>
		
		<view class="device-records-box permission-box">
			<view class="picker-container" @click="pickerImage">
				<view class="empty">
					<view class="plus-icon"></view>
					<view>从相册中选择</view>
				</view>
			</view>
			<view class="tips">推荐尺寸：562 * 330</view>
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
				pageTitle: '上传图片',
				deviceId:'',
				deviceName:'',
			};
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
		},
		methods: {
			
			// 返回
			goBack() {
				uni.navigateBack()
			},
			
			pickerImage(){
				let _this = this;
				uni.chooseImage({
					complete(res) {
						const filePath = res.tempFilePaths[0];
						_this.$upload({
							url:'/test/upload/img',
							filePath:filePath,
							name:'bgImg'
						})
					}
				})
			},
			// 保存设备编辑
			saveEdit() {
				// this.$request({
				// 	url: '/up-device-info/update-device-name-info',
				// 	method: 'post',
				// 	data: {
				// 		deviceName: this.deviceName,
				// 		deviceSn: this.deviceId
				// 	}
				// }).then(res => {
				// 	if (res.code === 200) {
				// 		uni.setStorageSync('deviceName', this.deviceName)
				// 		uni.showToast({
				// 			title: '编辑成功！'
				// 		})
				// 		setTimeout(() => {
				// 			uni.navigateBack()
				// 		}, 1500)
				// 	} else {
				// 		uni.showToast({
				// 			title: data.msg,
				// 			icon: 'error'
				// 		})
				// 	}
				// })
			}
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
	
	.picker-container{
		width: 563rpx;
		height: 331rpx;
		border: 1rpx dashed #dcdcdc;
		background: #F6F6F6;
		margin-top: 100rpx;
		margin-bottom: 50rpx;
		border-radius: 12rpx;
		
		.empty{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #525252;
			font-size: 30rpx;
			height: 100%;
			width: 100%;
			.plus-icon{
				width: 64rpx;
				height: 64rpx;
				position: relative;
				margin-bottom: 30rpx;
				&::before{
					display: block;
					content: "";
					position: absolute;
					top: 50%;
					left: 0;
					width: 100%;
					height: 2rpx;
					background-color: #272727;
				}
				&::after{
					display: block;
					content: "";
					position: absolute;
					top: 0;
					left: 50%;
					height: 100%;
					width: 2rpx;
					background-color: #272727;
				}
			}
		}
	}
	
	.device-records-box {
		width: 702rpx;
		// height: 542rpx;
		background: #FFFFFF;
		box-shadow: 2rpx 8rpx 40rpx 0px rgba(241, 241, 241, 0.8);
		border-radius: 30rpx;
		margin: 60rpx auto 0;
		box-sizing: border-box;
		padding: 54rpx 40rpx;
	}
	.permission-box {
		height: auto;
		margin-top: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.tips{
		font-size: 32rpx;
		color: #999;
		opacity: 0.8;
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
</style>
