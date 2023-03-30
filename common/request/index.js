import globals from "../../static/config/index.js"
export function request({
	url,
	method = 'post',
	data = {}
}) {
	let token = uni.getStorageSync('token')
	let header = {
		'Accept': 'application/json',
		'Content-Type': 'application/json; charset=utf-8',
	}
	if (token) {
		header.token = token
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: globals.api + url,
			method,
			data,
			header,
			success: (res) => {
				let data = res.data || null
				if (data.code == 200) {
					resolve(data)
				} else if (data.code === 301 || data.code === 302 || data.code === 303) {
					uni.showToast({
						title: '登录已过期',
						icon: 'error'
					})
					setTimeout(() => {
						uni.removeStorageSync('token')
						uni.removeStorageSync('username')
						uni.removeStorageSync('venueId')
						uni.removeStorageSync('locationId')
						uni.removeStorageSync('locationName')
						uni.removeStorageSync('deviceSn')
						uni.removeStorageSync('deviceName')
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1500)
				} else if (data.code === 305) {
					uni.showToast({
						title: '手机号未注册！',
						icon: 'error'
					})
				} else {
					reject(data)
				}
			},
			fail: (err) => {
				console.log(err)
				uni.hideLoading()
				uni.showModal({
					title: '提示',
					content: '网络断开...请稍后重试',
					showCancel: false,
					confirmColor: '#138FEA',
					success: function(res) {}
				})
			}
		})
	})
}
