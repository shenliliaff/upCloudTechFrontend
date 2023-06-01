import {mapState,mapMutations} from "vuex"
export default {
	computed:{
		...mapState(['type','bgImg','logo','selfDefine','dataSourceType','dataSource','otherUrl','versionCode','bannerImages','updateUrl','area','volume','image','name','desc']),
	},
}