import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// import {deviceDetail} from "../lib/api.js"
import {request} from "../common/request/index.js"

const store = new Vuex.Store({
    state: {
		"deviceSn": "", //设备SN号
		"type": "",
		"bgImg": "",
		"logo": "",
		"selfDefine": "",
		"dataSourceType": "", 
		"dataSource": "", 
		"versionCode": "", 
		"bannerImages": "" ,
		"updateUrl":"https://upcloudtech.cn/resource/img/banpai.apk",
		
		"area": "", 
		"volume": "", 
		"image": "", 
		"name": "",
		"desc": "" ,
		"locationId":""
		 
    },
    mutations: {
        
		setDeviceSn(state,deviceSn){
			state.deviceSn = deviceSn;
		},
		setType(state,type){
			state.type = type;
		},
		setBgImg(state,bgImg){
			state.bgImg = bgImg;
		},
		setLogo(state,logo){
			state.logo = logo;
		},
		setSelfDefine(state,selfDefine){
			state.selfDefine = selfDefine;
		},
		setDataSourceType(state,dataSourceType){
			state.dataSourceType = dataSourceType;
		},
		setDataSource(state,dataSource){
			state.dataSource = dataSource;
		},
		setVersionCode(state,versionCode){
			state.versionCode = versionCode;
		},
		setUpdateUrl(state,updateUrl){
			state.updateUrl = updateUrl;
		},
		
		setBannerImages(state,bannerImages){
			state.bannerImages = bannerImages;
		},
		
		setArea(state,area){
			state.area = area;
		},
		setVolume(state,volume){
			state.volume = volume;
		},
		setImage(state,image){
			state.image = image;
		},
		setName(state,name){
			state.name = name;
		},
		setDesc(state,desc){
			state.desc = desc;
		},
		setLocationId(state,locationId){
			state.locationId = locationId;
		},
    },
    actions: {
		// 获取设备详情
		getDeviceDetailInfo({state,commit}) {
			request({
				url: '/up-device-info/get-pad-device-Detail',
				method: 'get',
				data:{
					deviceSn:state.deviceSn
				}
			}).then(res => {
				if (res.code === 200) {
					let data = res.data;
					commit("setType",data.style);
					commit("setBgImg",data.backgroundUrl);
					commit("setLogo",data.logoUrl);
					commit("setSelfDefine",data.rightUrl);
					
					commit("setDataSourceType",data.dataSourceType);
					commit("setDataSource",data.dataSource);
					
					commit("setVersionCode",data.versionCode);
					commit("setUpdateUrl",data.updateUrl);
					commit("setBannerImages",data.bannerImages);
					
				}else{
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				}
			});
			request({
				url: '/up-location-info/get-location-detail',
				method: 'get',
				data:{
					locationId:state.locationId
				}
			}).then(res => {
				if (res.code === 200) {
					let data = res.data;
					commit("setArea",data.area);
					commit("setDesc",data.desc);
					commit("setImage",data.image);
					commit("setName",data.name);
					commit("setVolume",data.volume);
					
				}else{
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				}
			});
		},
		//更新班牌信息
		updateDeviceInfo({state}){
			let data = {
				"deviceSn":state.deviceSn,
				"type": state.type,
				"bgImg": state.bgImg,
				"logo": state.logo,
				"selfDefine": state.selfDefine,
				"dataSourceType": state.dataSourceType,
				"dataSource": state.dataSource,
				"versionCode": state.versionCode,
				"updateUrl": state.updateUrl,
				"bannerImages": state.bannerImages
			}
			request({
				url: '/up-device-info/update-device-img-info',
				method: 'POST',
				data:data,
			}).then(res => {
				uni.showToast({
					icon:'success',
					title:'更新成功'
				})
			})
			.catch(err=>{
				uni.showToast({
					icon:'error',
					title:'更新失败'
				})
			})
		},
		//更新房间信息
		updateRoomInfo({state}){
			let data = {
			  "locationName":state.name,
			  "locationId": state.locationId,
			  "modifier": "",
			  "area":state.area,
			  "volume":state.volume,
			  "desc":state.desc
			}
			request({
				url: '/up-location-info/update-location-detail-info',
				method: 'POST',
				data:data,
			}).then(res => {
				uni.showToast({
					icon:'success',
					title:'更新成功'
				})
			})
			.catch(err=>{
				uni.showToast({
					icon:'error',
					title:'更新失败'
				})
			})
		}
	}
})

export default store