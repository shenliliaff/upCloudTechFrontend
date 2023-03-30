<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">管理员</view>
		</view>
		<view class="content-box">
			<view class="person-item" v-for="p in persons" :key="p.user_id" @tap="selectPerson(p.user_id)">
				<view class="name">
					{{ p.user_name}}
				</view>
				<view class="checkbox">
					<uni-icons type="checkmarkempty" size="19" v-if="checkedList.indexOf(p.user_id) > -1"></uni-icons>
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
				venueId: '', // 场馆id
				deviceId: '', // 设备id
				checkedList: [], // 选中人员id
				// 人员列表数据
				persons: []
			}
		},
		onShow() {
			this.deviceId = uni.getStorageSync('deviceSn')
			let venueId = uni.getStorageSync('venueId')
			this.getPersons(venueId)
			this.getDeviceManager()
		},
		methods: {
			// 获取场馆所有人员
			getPersons(venueId) {
				this.$request({
					url: '/up-user-role-ref/get-users-by-roleName',
					method: 'get',
					data: {
						roleName: 'sys_admin',
						venueId: parseInt(venueId)
					}
				}).then(res => {
					if (res.code === 200) {
						if(res.data && res.data.length > 0) {
							this.persons = res.data
						} else {
							this.persons = []
						}
					} else {
						uni.showToast({
							title: res.msg
						})
					}
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
						this.checkedList = []
						res.data.forEach(item => {
							this.checkedList.push(item.user_id)
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
			},
			// 返回
			goBack() {
				uni.navigateBack()
			},
			// 选择人员
			selectPerson(id) {
				let index = this.checkedList.indexOf(id)
				if (index > -1) {
					this.checkedList.splice(index, 1)
				} else {
					this.checkedList.push(id)
				}
			},
			// 添加管理员
			addManager() {
				if (this.checkedList.length === 0) {
					uni.showToast({
						title: '请选择管理员',
						icon: 'error'
					})
					return false
				}
				// 批量添加
				let flag = 0
				this.checkedList.forEach(item => {
					
					this.$request({
						url: '/up-device-admin-ref/add-device-admins',
						method: 'POST',
						data: {
							creator: uni.getStorageSync('username'),
							userId: item,
							deviceSn: this.deviceId,
						}
					}).then(res => {
						if (res.code === 200) {
							flag++
							if (flag === this.checkedList.length) {
								uni.showToast({
									title: '添加成功！'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
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
			background: #fff;
			padding-bottom: 30rpx;
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
						color: #fff!important;
					}
				}
			}
		}
		
		.btn-box {
			width: 100%;
			background: #FFFFFF;
			position: absolute;
			left: 50%;
			bottom: 40rpx;
			padding-top: 40rpx;
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
