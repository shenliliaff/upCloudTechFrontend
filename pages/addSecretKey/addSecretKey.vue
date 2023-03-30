<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">添加钥匙</view>
		</view>
		<view class="content-box">
			<view class="person-info-box box">
				<view class="item-box">
					<input class="uni-input" type="text" :value="owner" @blur="ownerChange" placeholder="请填写钥匙名称" />
				</view>
				<view class="item-box">
					<input class="uni-input" type="number" :value="phone" @blur="checkPhone" maxlength="11" placeholder="请填写手机号码" />
				</view>
			</view>
			<view class="person-info-box box">
				<view class="startTime-box item-box">
					<uni-datetime-picker placeholder="开始时间" type="datetime" v-model="startTime" @change="startTimeChange" />
					<uni-icons type="forward" size="26"></uni-icons>
				</view>
				<view class="endTime-box item-box">
					<uni-datetime-picker placeholder="结束时间" type="datetime" v-model="endTime" @change="endTimeChange" />
					<uni-icons type="forward" size="26"></uni-icons>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn" @tap="addSecretKey">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				owner: '',
				endTime: '',
				startTime: '',
				phone: '',
				deviceId: ''
			}
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack()
			},
			ownerChange(val) {
				this.owner = val.detail.value
			},
			// 校验手机号
			checkPhone(val) {
				this.phone = val.detail.value
				if (this.phone === '') {
					callback1(new Error('手机号不可为空'));
				} else {
					if (this.phone !== '') {
						var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
						if (!reg.test(this.phone)) {
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
				this.startTime = val
			},
			// 结束时间选择
			endTimeChange(val) {
				this.endTime = val
			},
			// 保存秘钥
			addSecretKey() {
				if (this.owner === '') {
					uni.showToast({
						title: '钥匙名称不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.phone === '') {
					uni.showToast({
						title: '手机号不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.startTime === '') {
					uni.showToast({
						title: '开始时间不可为空',
						icon: 'error'
					})
					return false
				}
				if (this.endTime === '') {
					uni.showToast({
						title: '结束时间不可为空',
						icon: 'error'
					})
					return false
				}
				
				let sTime = this.startTime.replace('-', '/')
				sTime = new Date(Date.parse(sTime))
				
				let eTime = this.endTime.replace('-', '/')
				eTime = new Date(Date.parse(eTime))
				
				if (eTime < sTime) {
					uni.showToast({
						title: '请正确选择时间！',
						icon: 'error'
					})
					return false
				}
				this.$request({
					url: '/up-device-key-info/create-device-key-info',
					method: 'POST',
					data: {
						creator: uni.getStorageSync('username'),
						owner: this.owner,
						endTime: this.endTime,
						startTime: this.startTime,
						phone: this.phone,
						deviceSn: this.deviceId
					}
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '添加成功！'
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
				height: 238rpx;
				background: #FFFFFF;
				box-shadow: 2rpx 8rpx 40rpx 0px rgba(241,241,241,0.8);
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
				}
				.startTime-box, .endTime-box {
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
			width: 100%;
			// background: #FFFFFF;
			position: absolute;
			left: 50%;
			bottom: 82rpx;
			transform: translateX(-50%);
			text-align: center;
			box-sizing: border-box;
			.btn {
				display: inline-block;
				width: 464rpx;
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
</style>
