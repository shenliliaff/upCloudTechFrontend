<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">开门记录</view>
		</view>
		<view class="content-box" v-if="dateRecords.length > 0">
			<view class="device-records-box" v-for="(records, index) in dateRecords" :key="records.recordDate">
				<view class="date">
					{{ records.recordDate }}
				</view>
				<view class="records-box">
					<view class="record" v-for="(r, index) in records.records" :key="r.update_time">
						<view class="dot" :class="{'redDot': !r.OpenDoorStatus}"></view>
						<view class="item-box" :class="{'failed': !r.OpenDoorStatus}">
							<view class="time">
								{{ r.update_time }}
							</view>
							<view class="desc">
								{{ r.device_log_description }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no-record" v-else>
			暂无数据
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: '', // 设备id
				dateRecords: [],
				loading: false // 下拉刷新标识
			}
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.getRecords()
		},
		// 下拉刷新页面
		onPullDownRefresh() {
			this.loading = true
			this.getRecords()
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},
			// 获取记录
			getRecords() {
				this.$request({
					url: '/up-device-log-info/get-device-log-info',
					method: 'get',
					data: {
						deviceSn: this.deviceId,
						pageNum: 10000 // 最近3条记录
					}
				}).then(res => {
					if (res.code === 200) {
						this.dateRecords = []
						if(res.data && res.data.length > 0) {
							res.data[0].records.forEach(item => {
								if(this.dateRecords.length === 0) {
									let newRecord = {
										recordDate: '',
										records: []
									}
									newRecord.recordDate = item.date
									newRecord.records.push(item)
									this.$set(this.dateRecords, 0, newRecord)
								} else {
									let currentIndex = this.dateRecords.findIndex(v => {
										return v.recordDate === item.date
									})
									if (currentIndex === -1) {
										let newRecord = {
											recordDate: '',
											records: []
										}
										newRecord.recordDate = item.date
										newRecord.records.push(item)
										this.$set(this.dateRecords, this.dateRecords.length, newRecord)
									} else {
										this.dateRecords[currentIndex].records.push(item)
									}
								}
							})
						} else {
							this.dateRecords = []
						}
						if (this.loading) {
							this.loading = false
							uni.stopPullDownRefresh()
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
		padding: 90rpx 24rpx 30rpx;
		position: relative;

		.statusBar-box {
			display: flex;
			align-items: center;
			position: relative;

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
			margin-top: 66rpx;
			background: #FFFFFF;
			box-shadow: 8rpx 40rpx 65rpx 0px rgba(241, 241, 241, 0.8);
			border-radius: 30rpx;
			padding: 0 38rpx;

			.device-records-box {
				background: #FFFFFF;
				box-sizing: border-box;
				padding: 54rpx 0;
				border-bottom: 1px solid rgba(238, 238, 238, 1);

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
							width: 12rpx;
							height: 12rpx;
							background: #D2D2D2;
							border-radius: 50%;
							position: absolute;
							left: -50rpx;
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
			}
		}
	}
	
	.no-record {
		margin: 120rpx auto;
		text-align: center;
		font-size: 32rpx;
		font-weight: 400;
		color: #999999;
	}
</style>
