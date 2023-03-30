<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">设备位置</view>
		</view>
		<view class="content-box">
			<view class="person-item" v-for="p in persons" :key="p.id" @tap="selectPerson(p.id, p.locationName)">
				<view class="name">
					{{ p.locationName }}
				</view>
				<view class="checkbox">
					<uni-icons type="checkmarkempty" size="19" v-if="locationId === p.id"></uni-icons>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn" @tap="addManager">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				locationId: 0, // 教室id
				locationName: '', // 教室名称
				deviceId: 0, // 设备id
				deviceName: '', // 设备名称
				// 人员列表数据
				persons: []
			}
		},
		onLoad(option) {
			this.locationId = option.locationId * 1
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			this.deviceName = uni.getStorageSync('deviceName')
			this.getPlaces()
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 获取教室列表
			getPlaces() {
				this.$request({
					url: '/up-location-info/get-all-locations',
					method: 'get',
					data: {
						venueId: uni.getStorageSync('venueId'),
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.persons = res.data.slice(1)
						} else {
							this.persons = []
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
			// 选择教室
			selectPerson(id, name) {
				this.locationId = id
				this.locationName = name
			},
			// 修改设备所属教室
			addManager() {
				this.$request({
					url: '/up-device-info/update-device-location-info',
					method: 'POST',
					data: {
						LocationId: this.locationId,
						deviceSn: this.deviceId
					}
				}).then(res => {
					if (res.code === 200) {
						uni.setStorageSync('locationId', this.locationId)
						uni.setStorageSync('locationName', this.locationName)
						uni.showToast({
							title: '保存成功！'
						})
						setTimeout(() => {
							uni.navigateBack()
						})
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
		background: #fff;
		padding: 90rpx 0 30rpx;
		position: relative;

		.statusBar-box {
			display: flex;
			align-items: center;
			position: relative;
			padding-left: 34rpx;
			padding-bottom: 30rpx;
			background: #fff;
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
			top: 160rpx;
			left: 42rpx;
			right: 44rpx;
			bottom: 192rpx;
			overflow-y: scroll;
			.person-item {
				display: flex;
				justify-content: space-between;
				padding: 36rpx 0 30rpx;
				border-bottom: 1px solid rgba(238, 238, 238, 1);

				.name {
					font-size: 32rpx;
					font-weight: 500;
					color: #333333;
				}

				.checkbox {
					width: 46rpx;
					height: 46rpx;
					background: #7474FF;
					border-radius: 50%;
					text-align: center;
					line-height: 46rpx;

					::v-deep .uni-icons {
						color: #fff !important;
					}
				}
			}
		}

		.btn-box {
			width: 100%;
			background: #FFFFFF;
			position: absolute;
			left: 50%;
			bottom: 82rpx;
			transform: translateX(-50%);
			text-align: center;
			box-sizing: border-box;
			padding-top: 30rpx;
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
