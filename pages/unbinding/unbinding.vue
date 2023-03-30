<template>
	<view class="container">
		<view class="img-box">
			<image src="../../static/images/unbind.png" mode="widthFix"></image>
		</view>
		<view class="tip">
			您的账号暂未绑定单位
		</view>
		<view class="tip">
			请联系单位管理员
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	.img-box {
		padding-top: 400rpx;
		text-align: center;
		image {
			width: 499rpx;
			height: 291rpx;
		}
	}
	.tip {
		width: 308rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		text-align: center;
		margin: 0 auto;
	}
}
</style>
