<template>
	<view class="container">
		<view class="deparment-select">
			<!-- <view class="department" v-if="departments.length === 1"> -->
			<view class="department">
				<!-- {{ departments[0].name }} -->
				{{venueName}}
			</view>
			<!-- <uni-data-select v-model="venueId" :localdata="departments" @change="change" :clear="false"
				v-if="departments.length > 1"></uni-data-select> -->
			<uni-data-select v-model="venueId" :localdata="departments" @change="change" :clear="false"
				v-if="departments.length < 0"></uni-data-select>
		</view>
		<view class="navs">
			<view class="nav-box">
				<scroll-view class="scroll-view_H nav-box" scroll-x="true" scroll-left="0" :show-scrollbar="false"
					@touchmove.stop :scroll-into-view="'location' + locationId" scroll-with-animation>
					<view class="scroll-item" :id="'location' + place.id" :class="{'selectedP': locationId === place.id}" v-for="place in places"
						:key="place.id" @tap="placeChangeHandler(place.id, place.locationName)">
						{{ place.locationName }}
					</view>
				</scroll-view>
				<view class="addBtn">
					<view class="blank-bg">
						<image src="../../static/images/navMask.png" mode="widthFix" class="navMask"></image>
						<image src="../../static/images/add.png" mode="widthFix" @tap="addNewPlace"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="device-list-wrap">
			<view class="list-box" v-show="hasData">
				<view class="list-item" v-for="d in deviceList" :key="d.device_sn"
					@tap="pageToDeviceDetail(d.device_sn, d.device_name, d.location_id, d.isConnect)">
					
					<view class="item-top">
						<view class="device-name">
							{{ d.device_name }}
						</view>
						<view class="place-name">
							{{ d.location_name }}
						</view>
					</view>
					<view class="item-bottom">
						<view class="img-box">
							<image :src="d.imageUrl" mode="scaleToFill"></image>
						</view>
						<view class="lock-box" v-if="d.hasLock">
							<image src="@/static/images/locked.png" mode="widthFix" class="lock" v-if="d.isLocked">
							</image>
							<image src="@/static/images/lock.png" mode="widthFix" class="lock" v-else></image>
						</view>
						<view class="status-box" v-else>
							<view>{{ d.isConnect }}</view>
						</view>
					</view>
					<view class="mask" v-if="d.isConnect === '离线'"></view>
				</view>
			</view>
			<view class="no-device" v-show="!hasData">
				该场地暂无设备
			</view>
			<view class="edit-btn-box" v-if="locationId !== -1">
				<view class="edit-btn" @tap="editPlace">
					编辑
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false, // 下拉刷新中
				// 部门选中的值
				venueId: 0,
				venueName: '', // 机构名称
				// 部门数据
				departments: [],
				locationId: -1, // 当前场所code
				locationName: '', // 当前场所名称
				// 场所种类
				places: [],
				// 设备列表数据
				deviceList: [],
			}
		},
		computed: {
			// 判断设备列表是否有数据
			hasData() {
				return this.deviceList.length > 0
			}
		},
		// 下拉刷新页面
		onPullDownRefresh() {
			this.loading = true
			// this.getAllVenues()
			this.getVenueLocationDevices()
		},
		onShow() {
			// this.getAllVenues()
			this.venueId = uni.getStorageSync('venueId')
			this.venueName = uni.getStorageSync('venueName')
			console.log(this.venueName)
			this.getVenueLocationDevices()
		},
		onShareAppMessage(res) {
			return {
				title: '云智联小程序',
				path: '/pages/index/index',
				imageUrl: require('@/static/images/shareIcon.png')
			}
		},
		onShareTimeline() {
			return {
				title: '云智联小程序',
				path: '/pages/index/index',
				imageUrl: require('@/static/images/shareIcon.png')
			}
		},
		methods: {
			//获取部门
			getAllVenues() {
				this.$request({
					url: '/up-venue-info/get-all-venues',
					method: 'get'
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.departments = res.data
							this.departments.forEach(item => {
								item.value = item.id
								item.text = item.venueName
							})
							this.venueId = this.departments[0].value
							uni.setStorageSync('venueId', this.venueId)
							this.getVenueLocationDevices()
						} else {
							this.departments = []
						}
					}
				});
			},
			// 获取场地
			getVenueLocationDevices() {
				this.$request({
					url: '/up-location-info/get-all-locations',
					method: 'get',
					data: {
						venueId: this.venueId
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.places = res.data
							this.locationId = uni.getStorageSync('locationId') || this.places[0].id
							this.locationName = uni.getStorageSync('locationName') || this.places[0].locationName
							uni.setStorageSync('locationId', this.locationId)
							uni.setStorageSync('locationName', this.locationName)
							this.getLocationDevicesById()
						} else {
							this.places = []
						}
					}
				});
			},

			// 获取场地设备
			getLocationDevicesById() {
				this.$request({
					url: '/up-location-info/get-devices',
					method: 'get',
					data: {
						locationId: this.locationId,
						venueId: this.venueId
					}
				}).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.length > 0) {
							this.deviceList = res.data
							if (this.loading) {
								this.loading = false
								uni.stopPullDownRefresh()
							}
						} else {
							this.deviceList = []
						}
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'error'
					})
					this.deviceList = []
				})
			},

			// 增加新场地
			addNewPlace() {
				uni.navigateTo({
					url:'/pages/addPlace/addPlace?venueId=' + this.venueId
				})
			},

			// 场馆选择
			change(e) {
				uni.setStorageSync('venueId', e)
				this.venueId = e
				this.getVenueLocationDevices()
			},
			// 选择教室
			placeChangeHandler(code, name) {
				this.locationId = code
				this.locationName = name
				uni.setStorageSync('locationId', this.locationId)
				uni.setStorageSync('locationName', name)
				this.getLocationDevicesById()
			},
			// 跳转编辑场馆
			editPlace() {
				uni.navigateTo({
					url: '/pages/editPlace/editPlace?locationName=' + this.locationName + '&locationId=' + this
						.locationId
				})
			},
			// 点击设备跳转设备详情页面
			pageToDeviceDetail(deviceSn, deviceName, locationId, isConnect) {
				if (isConnect === '离线') {
					uni.showToast({
						title: '请检查设备状态',
						icon: 'error'
					})
					return fasle
				}
				// if(this.venueId == 2){
				if(locationId == 8){
					uni.navigateTo({
						url: '/pages/deviceDetail/psDeviceDetail?locationId=' + locationId
					})
				}else{
					uni.setStorageSync('deviceSn', deviceSn)
					uni.setStorageSync('deviceName', deviceName)
					uni.navigateTo({
						url: '/pages/deviceDetail/deviceDetail?locationId=' + locationId
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		padding: 24rpx;
		background: url('https://upcloudtech.cn/resource/bg.png') no-repeat;
		background-size: 100% 540rpx;
		box-sizing: border-box;
		padding-top: 110rpx;
	}

	.deparment-select {
		// width: 300rpx;
		display: inline-block;

		::v-deep .uni-select__input-text {
			margin-right: 20rpx;
			line-height: 60rpx;
		}
		
		.department {
			color: #fff;
		}
	}

	.navs {
		position: relative;
		margin-top: 90rpx;

		.nav-box {
			width: calc(100% - 40rpx);
			padding-left: 10rpx;
			align-items: center;
			white-space: nowrap;

			.scroll-item {
				display: inline-block;
				font-size: 36rpx;
				margin-right: 46rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.6);
				white-space: nowrap;
			}

			.selectedP {
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}

		.addBtn {
			position: absolute;
			top: -6rpx;
			right: 0;
			z-index: 100;

			.blank-bg {
				display: flex;
				align-items: flex-start;

				image {
					width: 49rpx;
					height: 49rpx;
					z-index: 100;
				}

				.navMask {
					width: 101rpx;
					height: 41rpx;
				}
			}
		}
	}

	.device-list-wrap {
		.list-box {
			display: flex;
			width: 100%;
			margin-top: 40rpx;
			flex-flow: row wrap;
			justify-content: space-between;

			.list-item {
				width: 340rpx;
				height: 228rpx;
				background: #FFFFFF;
				box-shadow: 8rpx 40rpx 65rpx 0px rgba(241, 241, 241, 0.8);
				border-radius: 30rpx;
				padding: 25rpx 22rpx 30rpx 25rpx;
				box-sizing: border-box;
				margin-bottom: 22rpx;
				position: relative;
				.item-top {
					display: flex;
					justify-content: space-between;

					.device-name {
						width: 200rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 26rpx;
						font-weight: 500;
						color: #1E1E1E;
					}

					.place-name {
						height: 36rpx;
						background: #F4F4F4;
						border-radius: 8rpx;
						font-size: 22rpx;
						font-weight: 400;
						color: #868585;
						text-align: center;
						line-height: 36rpx;
					}
				}

				.item-bottom {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					margin-top: 10rpx;

					image {
						width: 130rpx;
						height: 130rpx;
					}

					.lock {
						width: 66rpx;
						height: 66rpx;
					}

					.status-box {
						color: rgba(236, 145, 84, 1);
						position: relative;
						z-index: 100;
					}
				}
			}
			.mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(255, 255, 255, 0.6);
				z-index: 10;
				border-radius: 30rpx;
			}
		}

		.no-device {
			margin-top: 300rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: 400;
			color: #999999;
		}

		.edit-btn-box {
			display: block;
			width: 164rpx;
			height: 66rpx;
			margin: 69rpx auto;

			.edit-btn {
				width: 164rpx;
				height: 66rpx;
				background: #FFFFFF;
				box-shadow: 1px 7rpx 8rpx 0px #F1F1F1;
				border-radius: 33rpx;
				line-height: 66rpx;
				text-align: center;
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}
		}
	}




	::v-deep .uni-select {
		border: 0;
		font-weight: bold;
	}

	::v-deep .uni-select .uni-icons {
		color: #fff !important;
	}

	::v-deep .uni-select__input-text {
		font-size: 34rpx;
		font-weight: bold;
		color: #FEFEFE;
	}

	::v-deep .uni-select__selector-item {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}

	::v-deep ::-webkit-scrollbar {
		display: none;
		width: 0;
	}
</style>
