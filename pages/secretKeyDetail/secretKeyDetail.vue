<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">添加钥匙</view>
		</view>
		<view class="content-box">
			<view class="person-info-box box">
				<view class="item-box">
					<input class="uni-input" type="text" @blur="ownerChange" :value="keyData.owner" placeholder="请填写钥匙名称" />
				</view>
				<view class="item-box">
					<input class="uni-input" type="number" :value="keyData.phone" @blur="checkPhone"
						maxlength="11" placeholder="请填写手机号码" />
				</view>
			</view>
			<view class="person-info-box box">
				<view class="startTime-box item-box">
					<uni-datetime-picker placeholder="开始时间" type="datetime" v-model="keyData.start_time"
						@change="startTimeChange" />
					<uni-icons type="forward" size="26"></uni-icons>
				</view>
				<view class="endTime-box item-box">
					<uni-datetime-picker placeholder="结束时间" type="datetime" v-model="keyData.end_time"
						@change="endTimeChange" />
					<uni-icons type="forward" size="26"></uni-icons>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<image src="@/static/images/delete.png" mode="widthFix" @tap="deleteKey"></image>
			<image src="@/static/images/share.png" mode="widthFix" @tap="shareClickHandler"></image>
			<view class="btn" @tap="addSecretKey">保存</view>
		</view>
		
		<view class="mask" v-show="showMask" @tap="showMask = false">
			<view class="tip-box">
				<view class="tip txt">
					<view>点击</view>
					<view class="important">右上角</view>
				</view>
				<view class="txt">分享按钮进行分享</view>
			</view>
			<image src="@/static/images/share1.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMask: false, // 是否展示分享提示蒙层
				keyData: {}, // 钥匙数据
				username: '',
				deviceId: '' // 设备id
			}
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.username = uni.getStorageSync('username')
			this.keyData = uni.getStorageSync('keyData')
		},
		onShareAppMessage(res) {
			return {
				title: this.keyData.owner + '的钥匙',
				path: '/pages/sharePage/sharePage?modifier=' + this.username + '&deviceKeyId=' + this.keyData.id,
				imageUrl: require('@/static/images/shareIcon.png')
			}
		},
		onShareTimeline() {
			return {
				title: this.keyData.owner + '的钥匙',
				path: '/pages/sharePage/sharePage?modifier=' + this.username + '&deviceKeyId=' + this.keyData.id,
				imageUrl: require('@/static/images/shareIcon.png')
			}
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack()
			},
			ownerChange(val) {
				this.keyData.owner = val.detail.value
			},
			// 校验手机号
			checkPhone(val) {
				this.keyData.phone = val.detail.value
				if (this.keyData.phone === '') {
					callback1(new Error('手机号不可为空'));
				} else {
					if (this.keyData.phone !== '') {
						var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
						if (!reg.test(this.keyData.phone)) {
							callback(new Error('请输入有效的手机号码'));
						}
					}
				}
			
				function callback1(Error) {
					uni.showToast({
						title: '手机号码不能为空',
						icon: 'error'
					});
			
				}
			
				function callback(Error) {
					uni.showToast({
						title: '请输入有效的手机号码',
						icon: 'error'
					});
			
				}
			},
			// 开始时间选择
			startTimeChange(val) {
				this.keyData.start_time = val
			},
			// 结束时间选择
			endTimeChange(val) {
				this.keyData.end_time = val
			},
			// 保存秘钥
			addSecretKey() {
				if (this.keyData.owner === '') {
					uni.showToast({
						title: '钥匙名称不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.keyData.phone === '') {
					uni.showToast({
						title: '手机号不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.keyData.start_time === '') {
					uni.showToast({
						title: '开始时间不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.keyData.end_time === '') {
					uni.showToast({
						title: '结束时间不可为空',
						icon: 'error'
					})
					return false
				}
				
				let sTime = this.keyData.start_time.replace('-', '/')
				sTime = new Date(Date.parse(sTime))
				
				let eTime = this.keyData.end_time.replace('-', '/')
				eTime = new Date(Date.parse(eTime))
				
				if (eTime < sTime) {
					uni.showToast({
						title: '请正确选择时间！',
						icon: 'error'
					})
					return false
				}
				this.$request({
					url: '/up-device-key-info/update-device-key-info',
					method: 'post',
					data: {
						deviceKeyId: this.keyData.id,
						owner: this.keyData.owner,
						endTime: this.keyData.end_time,
						startTime: this.keyData.start_time,
						phone: this.keyData.phone,
						modifier: this.username
					}
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '保存成功！'
						})
						setTimeout(() => {
							this.goBack()
						}, 1500)
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
			// 删除钥匙
			deleteKey() {
				this.$request({
					url: '/up-device-key-info/delete-device-key',
					method: 'post',
					data: {
						deviceKeyId: this.keyData.id,
						modifier: this.username
					}
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '删除成功！'
						})
						setTimeout(() => {
							this.goBack()
						}, 1500)
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
			// 分享点击
			shareClickHandler() {
				this.showMask = true
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
			position: relative;
			z-index: 10;
			.box {
				height: 238rpx;
				background: #FFFFFF;
				box-shadow: 2rpx 8rpx 40rpx 0px rgba(241, 241, 241, 0.8);
				border-radius: 30rpx;
				padding: 20rpx 40rpx;
				box-sizing: border-box;
				margin-bottom: 24rpx;

				.item-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1px solid rgba(238, 238, 238, 1);
					padding: 30rpx 0;

					&:nth-last-child(1) {
						border-bottom: 0;
					}

					::v-deep .uni-input-input {
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}

					::v-deep .uni-input-placeholder {
						color: rgba(51, 51, 51, 0.5);
					}

					// 与上方模块文字对齐
					::v-deep .uni-date-x {
						padding: 0;
					}

					::v-deep .uni-date__x-input {
						padding: 0;
					}
				}

				.startTime-box,
				.endTime-box {
					padding: 16rpx 0;

					::v-deep .uni-date-x--border {
						border: 0;
					}

					::v-deep .uniui-clear,
					::v-deep .uniui-calendar {
						display: none;
					}
				}
			}

			.person-item {
				display: flex;
				justify-content: space-between;
				padding: 36rpx 0 30rpx;
				border-bottom: 1px solid rgba(238, 238, 238, 1);

			}
		}

		.btn-box {
			display: flex;
			width: 100%;
			height: 222rpx;
			background: #FFFFFF;
			position: absolute;
			left: 0;
			bottom: 0;
			text-align: center;
			box-sizing: border-box;
			padding: 48rpx 30rpx 0;
			justify-content: space-between;

			image {
				width: 150rpx;
				height: 90rpx;
			}

			.btn {
				display: inline-block;
				width: 352rpx;
				height: 90rpx;
				background: linear-gradient(268deg, #6D6DFF 0%, #5E5EFF 100%);
				border-radius: 44rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				line-height: 90rpx;
			}
		}
	}
	
	.mask {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.8);
		z-index: 100;
		image {
			width: 174rpx;
			height: 321rpx;
			position: absolute;
			right: 200rpx;
			top: 120rpx;
		}
		.tip-box {
			width: 100%;
			position: absolute;
			top: 500rpx;
			text-align: center;
		}
		.txt {
			font-size: 36rpx;
			color: #fff;
		}
		.tip {
			display: flex;
			width: 100%;
			justify-content: center;
			.important {
				color: yellow;
			}
		}
	}
</style>
