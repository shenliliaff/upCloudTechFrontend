<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">
				{{ deviceName }}
			</view>
		</view>
		<view class="device-records-box permission-box">
			<view class="device-title">
				设备编号:56702
			</view>
			<view class="data-style">
				<view :class="['data-style-item',{active:style === '默认'}]" @tap="changeStyle('默认')">默认板式</view>
				<view :class="['data-style-item',{active:style === '轮播'}]" @tap="changeStyle('轮播')">轮播图片</view>
			</view>
		</view>
		<block v-if="style === '默认'">
			<view class="device-records-box permission-box">
				<view class="permission-item" @tap="pageToSingleImage">
					<view class="item-left">背景图</view>
					<view class="item-right">
						<uni-icons type="forward" size="24"></uni-icons>
					</view>
				</view>
				<view class="permission-item" @tap="pageToSingleImage">
					<view class="item-left">logo图</view>
					<uni-icons type="forward" size="24"></uni-icons>
				</view>
				<view class="permission-item" @tap="pageToSingleImage">
					<view class="item-left">自定义区</view>
					<view class="item-right">
						<uni-icons type="forward" size="24"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="device-records-box permission-box">
				<view class="permission-item" @tap="pageToSourceType">
					<view class="item-left">场地信息</view>
					<view class="item-right">
						<view>{{sourceType === 0?'自定义':'其他数据源'}}</view>
						<uni-icons type="forward" size="24"></uni-icons>
					</view>
				</view>
				<block v-if="sourceType === 0">
					<view class="permission-item" @tap="pageToInput(1)">
						<view class="item-left">房间名称</view>
						<view class="item-right">
							<view>{{test}}</view>
							<uni-icons type="forward" size="24"></uni-icons>
						</view>
					</view>
					<view class="permission-item" @tap="pageToInput(2)">
						<view class="item-left">房间面积</view>
						<view class="item-right">
							<view>{{test}}</view>
							<uni-icons type="forward" size="24"></uni-icons>
						</view>
					</view>
					<view class="permission-item" @tap="pageToInput(3)">
						<view class="item-left">容纳人数</view>
						<view class="item-right">
							<view>{{test}}</view>
							<uni-icons type="forward" size="24"></uni-icons>
						</view>
					</view>
					<view class="permission-item" @tap="pageToInput(4)">
						<view class="item-left">简介</view>
						<view class="item-right">
							<view>{{test}}</view>
							<uni-icons type="forward" size="24"></uni-icons>
						</view>
					</view>
				</block>
				<block v-if="sourceType === 1">
					<view class="permission-item" @tap="pageToInput(5)">
						<view class="item-left">数据源地址</view>
						<view class="item-right">
							<view>{{test}}</view>
							<uni-icons type="forward" size="24"></uni-icons>
						</view>
					</view>
				</block>
			</view>
		</block>
		<!-- 轮播图 -->
		<block v-if="style === '轮播'">
			<view class="swiper-container">
				<view class="picker-container" @click="pickerImage">
					<view class="empty">
						<view class="plus-icon"></view>
						<view>添加图片</view>
					</view>
				</view>
				<view class="banner-image" v-for="(img,idx) in banners">
					<image @click="previewImage(idx)" class="image" mode="aspectFill" :src="img"></image>
					<view class="delete" @tap="removeBanner(idx)">
						<uni-icons type="clear" color="#F4483B" size="30"></uni-icons>
					</view>
				</view>
			</view>
		</block>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceSn: 0,
				deviceName: '', // 设备名称
				locationName: '', // 设备所处教室
				locationId: '', // 教室id
				style:'默认',
				sourceType:0,
				test:'测试',
				banners:[]
			}
		},
		onLoad(option) {
			this.locationId = option.locationId
		},
		onShow() {
			// this.deviceSn = uni.getStorageSync('deviceSn');
			this.deviceSn = 'test123456';
			this.getDeviceDetailInfo()
		},
		methods: {
			// 获取设备详情
			getDeviceDetailInfo() {
				let _this = this;
				this.$request({
					url: '/test/up-device-info/get-pad-device-Detail',
					method: 'get',
					data:{
						deviceSn:this.deviceSn
					}
				}).then(res => {
					if (res.code === 200) {
						let data = res.data;
						_this.style = data.style;
					}else{
						uni.showToast({
							icon:'none',
							title:res.msg
						})
					}
				});
			},
			
			pageToSingleImage(){
				uni.navigateTo({
					url:'/pages/singleImage/singleImage'
				})
			},
			// 返回
			goBack() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			changeStyle(style){
				this.style = style;
				this.saveInfo()
			},
			pageToSourceType(){
				let _this = this;
				uni.showActionSheet({
					itemList:[
						"自定义",
						"其他数据源"
					],
					success(res) {
						_this.sourceType = res.tapIndex;
					}
				})
			},
			pageToInput(type){
				uni.navigateTo({
					url: "/pages/inputPage/inputPage?type=i"+type+"&deviceId="+this.deviceId
				})
			},
			pickerImage(){
				let _this = this;
				uni.chooseImage({
					complete(res) {
						_this.banners.push(res.tempFilePaths[0])
					}
				})
			},
			
			previewImage(idx){
				uni.previewImage({
					urls:this.banners,
					current:idx
				})
			},
			removeBanner(idx){
				this.banners.splice(idx,1);
			},
			
			saveInfo(){
				let data = {
					"deviceSn":this.deviceSn,
					"type": this.style,
					
				};
				this.$request({
					url: '/test/up-device-info/update-device-img-info',
					method: 'post',
					data:data
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							icon:'none',
							title:'保存成功'
						})
					}else{
						uni.showToast({
							icon:'none',
							title:'保存失败'
						})
					}
				}).catch(err=>{
					uni.showToast({
						icon:'none',
						title:'保存失败'
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
		background: url('https://upcloudtech.cn/resource/lockedBg.png') no-repeat;
		background-size: 100%;
		box-sizing: border-box;
		padding: 110rpx 0 225rpx;
		position: relative;

		.device-title{
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 70rpx;
		}
		.data-style{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.data-style-item{
				width: 266rpx;
				height: 142rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				border: 4rpx solid #eee;
				border-radius: 12rpx;
				font-weight: bold;
				color: #6d6d6d;
				font-size: 26rpx;
				&.active{
					border-radius: 12rpx;
					border-color: transparent;
					outline: 12rpx solid #6a6bff;
				}
			}
		}
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
	}
	.device-records-box {
		::v-deep .uni-icons {
			color: rgba(153, 153, 153, 1) !important;
		}
	}

	::v-deep .uniui-back {
		color: #fff !important;
	}
	
	.swiper-container{
		display: flex;
		flex-direction: column;
		align-items: center;
		.banner-image{
			width: 563rpx;
			height: 331rpx;
			margin-top: 30rpx;
			position: relative;
			.image{
				width: 100%;
				height: 100%;
			}
			.delete{
				color: orangered;
				position: absolute;
				right: -30rpx;
				top: -30rpx;
			}
		}
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
</style>
