<template>
	<view class="container" :class="{'unlock': !status}">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">
				{{ pageTitle }}
			</view>
		</view>

		<view class="device-status-box">
			<!-- 已上锁logo -->
			<view class="device-img" v-if="status">
				<image src="../../static/images/openLock.png" mode="heightFix"></image>
			</view>
			<!-- 未上锁logo -->
			<view class="device-img" v-else>
				<image src="../../static/images/unlockLogo.png" class="unlockedImg" mode="heightFix"></image>
			</view>
			<view class="device-status">
				{{ deviceStatusName }}
			</view>
		</view>

		<view class="device-records-box">
			<view class="date">
				{{ recordDate }}
			</view>
			<view class="records-box" v-if="records.length > 0">
				<view class="record" v-for="(r, index) in records" :key="r.index">
					<view class="dot" :class="{'redDot': !r.OpenDoorStatus}"></view>
					<view class="item-box" :class="{'failed': !r.OpenDoorStatus}">
						<view class="time">
							{{ r.time }}
						</view>
						<view class="desc">
							{{ r.device_log_description }}
						</view>
					</view>
				</view>
			</view>
			<view class="no-record" v-else>
				暂无数据
			</view>
			<view class="get-more">
				<view class="more-btn" @tap="getMore">
					查看更多
				</view>
			</view>
		</view>
		<view class="device-records-box permission-box">
			<view class="permission-item" @tap="pageToManager">
				<view class="item-left">管理员</view>
				<view class="item-right">
					<view>{{managers}}人</view>
					<uni-icons type="forward" size="24"></uni-icons>
				</view>
			</view>
			<view class="permission-item" @tap="pageToSecretkeyManagement">
				<view class="item-left">临时密钥</view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
			<view class="permission-item" @tap="pageToPlaceManagement">
				<view class="item-left">设备位置</view>
				<view class="item-right">
					<view>{{locationName}}</view>
					<uni-icons type="forward" size="24"></uni-icons>
				</view>
			</view>
			<view class="permission-item" @tap="pageToDeveiceManagement">
				<view class="item-left">设备名称</view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
		</view>
		<view class="device-records-box permission-box">
			<view class="permission-item" @tap="pageToStatistics">
				<view>数据统计</view>
				<uni-icons type="forward" size="24"></uni-icons>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn" :animation="animationData" :class="{'unlockedBtn': !status}" @touchend="handleTouchend"
				@touchstart="handleTouchstart" @touchmove="handleTouchmove">长按开锁</view>
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
				deviceStatusName: '',
				recordDate: '今天',
				status: '已上锁',
				records: [],
				managers: 0, // 设备管理员人数
				timer: null, // 长按计时,
				animationData: {}, // 动画数据
				animation: {}, // 动画对象
			}
		},
		onLoad(option) {
			this.locationId = option.locationId
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
			this.getDeviceDetailInfo()
			this.getDeviceManager()
			var animation = uni.createAnimation({
				duration: 1000, // 动画时间
				timingFunction: 'ease' // 动画速度
			})
			this.animation = animation
		},
		methods: {
			// 获取设备详情
			getDeviceDetailInfo() {
				this.$request({
					url: '/up-device-info/get-device-detail-info',
					method: 'get',
					data: {
						deviceSn: this.deviceId,
						pageNum: 3 // 最近3条记录
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.records = res.data
							let deviceData = this.records[0]
							this.pageTitle = deviceData.location_name + '的' + deviceData.device_type_name
							this.deviceStatusName = deviceData.DoorStatus ? '已上锁' : '未上锁'
							this.recordDate = deviceData.recordDate
							this.status = deviceData.DoorStatus
							this.locationName = deviceData.location_name
							this.locationId = deviceData.location_id
							this.records.forEach(item => {
								item.time = item.update_time[3] + ':' + item.update_time[4]
							})
						} else {
							this.records = []
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
			// 获取设备管理员
			getDeviceManager() {
				this.$request({
					url: '/up-device-admin-ref/get-device-admins',
					method: 'get',
					data: {
						deviceSn: this.deviceId,
					}
				}).then(res => {
					if (res.code === 200) {
						this.managers = res.data && res.data.length || 0
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
					url: '/pages/index/index'
				})
			},
			// 查看更多
			getMore() {
				uni.navigateTo({
					url: '/pages/openRecords/openRecords'
				})
			},
			// 跳转管理员页面
			pageToManager() {
				uni.navigateTo({
					url: '/pages/addManager/addManager'
				})
			},
			// 跳转临时秘钥页面
			pageToSecretkeyManagement() {
				uni.navigateTo({
					url: '/pages/secretKeyManagement/secretKeyManagement'
				})
			},
			// 跳转设备位置页面
			pageToPlaceManagement() {
				uni.navigateTo({
					url: '/pages/devicePositionManagement/devicePositionManagement?locationId=' + this.locationId
				})
			},
			// 跳转设备名称页面
			pageToDeveiceManagement() {
				uni.navigateTo({
					url: '/pages/editDevice/editDevice'
				})
			},
			// 数据统计页面跳转
			pageToStatistics() {
				uni.showToast({
					title: "功能即将上线",
					icon: "error"
				})
			},
			// 触摸开始
			handleTouchstart() {
				if (this.status) {
					this.animation.opacity(0.5).step()
					this.animationData = this.animation.export()
					this.timer = setTimeout(() => {
						this.openDoor()
					}, 1000)
				}
			},
			// 长按结束
			handleTouchend() {
				clearTimeout(this.timer)
				return false
			},
			// 长按移动，清除计时器
			handleTouchmove() {
				clearTimeout(this.timer)
			},
			// 长按开门
			openDoor() {
				this.$request({
					url: '/up-device-info/remote_open_door',
					method: 'post',
					data: {
						remoteOperation: 'open_door',
						deviceSn: this.deviceId,
						modifier: uni.getStorageSync('username')
					}
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '开锁成功！'
						})
						this.animation.opacity(1).step()
						this.animationData = this.animation.export()
						setTimeout(() => {
							this.getDeviceDetailInfo()
							this.getDeviceManager()
						}, 1500)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						})
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'error'
					})
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

		.device-status-box {
			margin-top: 112rpx;
			text-align: center;

			.device-img {
				height: 230rpx;

				image {
					height: 230rpx;
					margin-left: 56rpx;
				}

				.unlockedImg {
					margin-left: 30rpx;
				}
			}

			.device-status {
				margin-top: 42rpx;
				font-size: 48rpx;
				font-weight: 500;
				color: #FFFFFF;
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

			.date {
				font-size: 42rpx;
				font-weight: 500;
				color: #333333;
			}

			.records-box {
				margin-top: 60rpx;
				padding: 12rpx 44rpx;
				border-left: 1px solid rgba(210, 210, 210, 1);

				.record {
					position: relative;
					display: flex;
					margin-bottom: 60rpx;

					.dot {
						width: 11rpx;
						height: 11rpx;
						background: #D2D2D2;
						border-radius: 50%;
						position: absolute;
						left: -51rpx;
						top: 50%;
						transform: translateY(-50%);
					}

					.redDot {
						background: rgba(244, 72, 59, 1);
					}

					.item-box {
						display: flex;
						font-size: 32rpx;
						font-weight: 400;
						color: #333333;

						.time {
							margin-right: 40rpx;
						}

						.desc {
							width: 450rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}

					.failed {
						color: rgba(244, 72, 59, 1);
					}

					&:nth-last-child(1) {
						margin-bottom: 0;
					}
				}
			}

			.get-more {
				margin-top: 52rpx;
				text-align: center;

				.more-btn {
					display: inline-block;
					font-size: 36rpx;
					font-weight: 500;
					color: #4845D9;
				}
			}
		}

		.permission-box {
			height: auto;
			margin-top: 24rpx;

			.permission-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 30rpx;
				border-bottom: 1px solid #EEEEEE;
				margin-top: 35rpx;

				.item-left {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
				}

				.item-right {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					font-weight: 400;
					color: #999999;

					.uni-icons {
						margin-left: 20rpx;
					}
				}

				&:first-child {
					margin-top: 0;
				}
			}

			.permission-item:last-child {
				border-bottom: 0;
				padding-bottom: 0;
			}
		}

		.statistics-box {
			height: auto;
		}

		.btn-box {
			width: 100%;
			height: 205rpx;
			background: #FFFFFF;
			position: fixed;
			left: 0;
			bottom: 0;
			text-align: center;
			box-sizing: border-box;
			padding-top: 33rpx;

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

			.unlockedBtn {
				background: linear-gradient(268deg, #6D6DFF 0%, #5E5EFF 100%);
				opacity: 0.5;
			}
		}
	}

	.unlock {
		background: url('https://upcloudtech.cn/resource/notLockBg.png') no-repeat;
		background-size: 100%;
	}

	.device-records-box {
		::v-deep .uni-icons {
			color: rgba(153, 153, 153, 1) !important;
		}
	}

	::v-deep .uniui-back {
		color: #fff !important;
	}
</style>
