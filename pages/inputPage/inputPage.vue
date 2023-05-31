<template>
	<view class="container">
		<view class="statusBar-box">
			<uni-icons type="back" size="30" @tap="goBack"></uni-icons>
			<view class="page-title">{{types[type].title}}</view>
		</view>
		<view class="content-box">
			<view class="person-info-box box">
				<view class="item-box">
					<input class="uni-input" type="text" :maxlength="types[type].maxLength" v-model="value" focus placeholder="请填写" />
					<view class="length">
						{{value.length + '/' + types[type].maxLength}}
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<view class="cancel-btn" @tap="goBack">取消</view>
			<view class="btn" @tap="saveEdit">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '' ,
				type:'',
				types:{
					'i1':{
						title:'房间名称',
						maxLength:10,
						key:'name',
						storeSet:'setName',
					},
					'i2':{
						title:'房间面积',
						maxLength:10,
						key:'area',
						storeSet:'setArea',
					},
					'i3':{
						title:'容纳人数',
						maxLength:10,
						key:'volume',
						storeSet:'setVolume',
					},
					'i4':{
						title:'简介',
						maxLength:30,
						key:'desc',
						storeSet:'setDesc',
					},
					'i5':{
						title:'数据源地址',
						maxLength:200,
						key:'otherUrl',
						storeSet:'setOtherUrl',
					},
					'i6':{
						title:'版本号',
						maxLength:5,
						key:'versionCode',
						storeSet:'setVersionCode',
					}
				}
			}
		},
		onLoad(option) {
			this.type = option.type;
			this.value = this.$store.state[this.types[this.type].key]
		},
		methods: {
			// 
			locationNameChange(e) {
				this.locationName = e.detail.value
				this.locationNameLength = this.locationName.length
			},
			// 返回
			goBack() {
				uni.navigateBack()
			},
			
			saveEdit() {
				this.$store.commit(this.types[this.type].storeSet,this.value);
				if(this.type === 'i5' || this.type === 'i6'){
					this.$store.dispatch('updateDeviceInfo');
				}else{
					this.$store.dispatch('updateRoomInfo');
				}
				
				setTimeout(function(){
					uni.navigateBack();
				},1500)
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
				.item-box {
					width: 702rpx;
					height: 112rpx;
					background: #FFFFFF;
					border-radius: 30rpx;
					position: relative;
					::v-deep .uni-input {
						height: 112rpx;
						line-height: 112rpx;
						padding-left: 40rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
					
					::v-deep .uni-input-placeholder {
						color: rgba(51, 51, 51, 0.5);
					}
					.length {
						position: absolute;
						top: 50%;
						right: 40rpx;
						transform: translateY(-50%);
						font-size: 26rpx;
						font-weight: 400;
						color: #999999;
					}
				}
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
				background: rgba(153, 153, 153, 0.2);
				border-radius: 44px;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
				text-align: center;
				line-height: 90rpx;
			}
		}
	}
</style>
