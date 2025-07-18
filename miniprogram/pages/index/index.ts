// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 导入工具函数和配置
import { request } from '../../utils/util'
import config from '../../config/config'

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    apiData: null,
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.fetchApiData();
    }
  },
  methods: {
    // 获取API数据
    fetchApiData() {
      // 使用封装的请求函数和配置文件
      request({
        url: `${config.apiBaseUrl}${config.apiUrls.test}`,
        method: 'GET',
        useMock: config.useMock // 根据环境配置决定是否使用模拟数据
      })
      .then(res => {
        console.log('API请求成功:', res.data);
        // 将对象转换为格式化的JSON字符串
        const formattedData = typeof res.data === 'object' ? 
          JSON.stringify(res.data, null, 2) : res.data.toString();
        this.setData({
          apiData: formattedData
        });
      })
      .catch(err => {
        console.error('API请求失败:', err);
        // 显示错误提示
        this.setData({
          apiData: '请求失败：' + (err.message || '未知错误')
        });
        // 显示错误提示
        wx.showToast({
          title: '请求失败',
          icon: 'error',
          duration: 2000
        });
      });
    },
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
  },
})
