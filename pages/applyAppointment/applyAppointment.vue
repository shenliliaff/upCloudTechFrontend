<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">
				审核通知
			</view>
		</view>
		<view class="bg"></view>
		<view class="device-records-box">
			<view class="records-title">审核内容</view>
			<view>
				场地预约：XXX文化馆的舞蹈排练室 文化馆的舞蹈排练室文化馆的舞蹈排练室文化馆的舞蹈排练室文化馆的舞蹈排练室
			</view>
			<viwe>
				预约时间：2023.04.03 15:30~19:00 
			</viwe>
			<view>
				申请人：黄小哇
			</view>
		</view>
		
		<view class="device-records-box box2">
			<view class="records-title">审核时间</view>
			<view>
				2023.04.03 15:30
			</view>
		</view>
		
		<view class="btn-box">
			<view class="cancel-btn" @tap="applyResult">驳回</view>
			<view class="btn" @tap="applyResult">通过</view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			}
		},
		
		onLoad(option) {
			
			
		},
		
		onShow() {
			
		},
		methods: {
		
			// 返回
			goBack() {
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			
			//通过/驳回
			applyResult(){
				
			}
			
		}
	}
</script>


<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		padding: 24rpx;
		box-sizing: border-box;
		padding: 110rpx 0 225rpx;
		position: relative;

		.bg{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 469rpx;
			background: linear-gradient(-18deg, #5252FF 0%, #7272FF 100%);
			z-index: -1;
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
			margin: 100rpx auto 0;
			box-sizing: border-box;
			padding: 54rpx 40rpx;
			
			font-size: 32rpx;
			color: #999999;
			line-height: 60rpx;
			
			.records-title{
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
			}
			
			&.box2{
				margin-top: 24rpx;
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
				background: #E4E4FF;
				border-radius: 44px;
				font-size: 36rpx;
				font-weight: 500;
				color: #5F5FFF;
				text-align: center;
				line-height: 90rpx;
			}
		}
		
	}
	
	::v-deep .uniui-back {
		color: #fff !important;
	}
	
	
</style>
