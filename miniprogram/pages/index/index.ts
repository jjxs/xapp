// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 导入工具函数和配置
import { request, formatImageUrl } from '../../utils/util'
import config from '../../config/config'

// 菜单分类接口数据类型定义
interface MenuCategory {
  id: number;
  name: string;
  display_name: string;
  domain: string;
  master_data: MenuSubcategory[];
  display_order: number;
  extend: any;
  option: any;
  enabled: number;
}

interface MenuSubcategory {
  id: number;
  code: number;
  name: string;
  display_name: string;
  display_order: number;
  theme_id: string;
  menu_count: number;
  note: any;
  extend: any;
  option: any;
  group: number;
}

// 菜单项接口数据类型定义
interface MenuItem {
  category: number;
  category_group: number;
  category_name: string;
  display_order: number;
  id: number;
  menu: number;
  menu_id: number;
  menu_no: number;
  image: string;
  menu_name: string;
  menu_price: number;
  menu_ori_price: number;
  menu_usable: boolean;
  updated_at: string;
  stock_status: number;
  note: any;
  tax_in: boolean;
  mincount: number;
  is_free: number;
  introduction: any;
  level: any;
  menu_options: any;
  course: any[];
}

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
    showRawData: false, // デバッグ用：生データ表示フラグ
    
    // メニューカテゴリーデータ
    menuCategories: [] as MenuCategory[],
    selectedCategoryId: null as number | null,
    selectedCategory: null as MenuCategory | null,
    selectedSubcategoryId: null as number | null,
    
    data: {
      // ... 其他数据保持不变
      
      // 菜单项数据
      menuItems: [] as MenuItem[], // 存储所有菜单项
      filteredMenuItems: [] as MenuItem[], // 存储筛选后的菜单项
      isLoadingMenuItems: false,
    },
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
        console.log(123)
      // 显示加载中
      wx.showLoading({ title: '読み込み中...' });
      
      // 使用封装的请求函数和配置文件
      request({
        url: `${config.apiBaseUrl}${config.apiUrls.master}`,
        method: 'GET'
      })
      .then(res => {
        console.log('API请求成功:', res.data);
        
        // 将对象转换为格式化的JSON字符串（用于调试显示）
        const formattedData = typeof res.data === 'object' ? 
          JSON.stringify(res.data, null, 2) : res.data.toString();
          
        // 处理菜单分类数据
        let menuData = [];
        if (Array.isArray(res.data)) {
          // 按照display_order排序
          menuData = res.data.sort((a, b) => a.display_order - b.display_order);
          
          // 过滤掉不需要显示的分类
          menuData = menuData.filter(item => {
            // 检查是否启用
            if (item.enabled !== 1) return false;
            
            // 检查是否有显示选项
            if (item.option && item.option.display === false) return false;
            
            return true;
          });
          
          // 如果有数据，默认选中第一个分类
          if (menuData.length > 0) {
            const firstCategoryId = menuData[0].id;
            let firstSubcategoryId = null;
            
            // 如果第一个分类有子分类，默认选中第一个子分类
            if (menuData[0].master_data && menuData[0].master_data.length > 0) {
              firstSubcategoryId = menuData[0].master_data[0].id;
            }
            
            this.setData({
              selectedCategoryId: firstCategoryId,
              selectedCategory: menuData[0],
              selectedSubcategoryId: firstSubcategoryId
            });
            
            // 在设置完默认分类后，立即获取该分类的菜单项
            this.fetchMenuItems(firstCategoryId);
          }
        }
        
        this.setData({
          apiData: formattedData,
          menuCategories: menuData
        });
        
        wx.hideLoading();
      })
      .catch(err => {
        console.error('API请求失败:', err);
        // 显示错误提示
        this.setData({
          apiData: '请求失败：' + (err.message || '未知错误')
        });
        // 显示错误提示
        wx.hideLoading();
        wx.showToast({
          title: '読み込み失敗',
          icon: 'error',
          duration: 2000
        });
      });
    },
    
    // 选择顶级分类
    // 选择顶级分类
    selectCategory(e: any) {
      const id = e.currentTarget.dataset.id;
      const index = e.currentTarget.dataset.index;
      const category = this.data.menuCategories[index];
      
      this.setData({
        selectedCategoryId: id,
        selectedCategory: category,
        selectedSubcategoryId: category.master_data && category.master_data.length > 0 ? 
          category.master_data[0].id : null
      });
      
      console.log('选择分类:', category.display_name);
      
      // 获取该大分类下的所有菜单项
      this.fetchMenuItems(id);
    },
    
    // 选择子分类
    // 选择子分类
    selectSubcategory(e: any) {
      const id = e.currentTarget.dataset.id;
      
      this.setData({
        selectedSubcategoryId: id
      });
      
      // 筛选该子分类下的菜单项（不再请求API）
      this.filterMenuItemsBySubcategory(id);
      
      // 示例：显示菜单数量提示
      const index = e.currentTarget.dataset.index;
      const subcategory = this.data.selectedCategory?.master_data[index];
      if (subcategory) {
        wx.showToast({
          title: `${subcategory.display_name}: ${subcategory.menu_count}個のメニュー`,
          icon: 'none',
          duration: 1500
        });
      }
    },
    
    // 获取菜单项数据
    fetchMenuItems(categoryId: number) {
      // 显示加载状态
      this.setData({
        isLoadingMenuItems: true,
        menuItems: [], // 清空之前的菜单项
        filteredMenuItems: [] // 清空筛选后的菜单项
      });
      
      wx.showLoading({ title: 'メニュー読み込み中...' });
      
      // 构建API URL，使用大分类ID
      const apiUrl = `${config.apiBaseUrl}${config.apiUrls.menuItems}${categoryId}`;
      
      request({
        url: apiUrl,
        method: 'GET'
      })
      .then(res => {
        console.log('菜单项数据获取成功:', res.data);
        
        // 处理菜单项数据
        let menuItems = [];
        if (Array.isArray(res.data)) {
          
          menuItems = res.data.map(item => {
            return {
              ...item,
              // 格式化图片URL
              image: formatImageUrl(item.image)
            };
          });
          
          // 按照display_order排序
          menuItems = menuItems.sort((a, b) => a.display_order - b.display_order);
        }
        
        this.setData({
          menuItems: menuItems,
          isLoadingMenuItems: false
        });
        
        // 初始筛选：如果有选中的子分类，筛选该子分类下的菜单项
        if (this.data.selectedSubcategoryId) {
          this.filterMenuItemsBySubcategory(this.data.selectedSubcategoryId);
        } else {
          // 否则显示所有菜单项
          this.setData({
            filteredMenuItems: menuItems
          });
        }
        
        wx.hideLoading();
      })
      .catch(err => {
        console.error('菜单项数据获取失败:', err);
        
        this.setData({
          isLoadingMenuItems: false
        });
        
        wx.hideLoading();
        wx.showToast({
          title: 'メニュー読み込み失敗',
          icon: 'error',
          duration: 2000
        });
      });
    },
    
    // 切换显示原始数据（调试用）
    toggleRawData() {
      this.setData({
        showRawData: !this.data.showRawData
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
    // 根据子分类筛选菜单项
    filterMenuItemsBySubcategory(subcategoryId: number) {
    // 获取所有菜单项（已经通过fetchMenuItems获取）
    const allMenuItems = this.data.menuItems;
    
    // 如果没有菜单项，直接返回
    if (!allMenuItems || allMenuItems.length === 0) {
      return;
    }
    
    // 筛选属于该子分类的菜单项
    const filteredItems = allMenuItems.filter(item => item.category === subcategoryId);
    
    // 更新显示的菜单项
    this.setData({
      filteredMenuItems: filteredItems
    });
    } // 删除这里的逗号
  }
})
