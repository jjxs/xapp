// 小程序配置文件

// 环境配置
const ENV = {
  DEV: 'development',  // 开发环境
  TEST: 'test',        // 测试环境
  PROD: 'production'   // 生产环境
};

// 当前环境
const CURRENT_ENV = ENV.DEV;

// API基础URL配置
const API_BASE_URL = {
  [ENV.DEV]: 'http://192.168.1.105:8000',  // 开发环境API地址
  [ENV.TEST]: 'https://test-api.example.com', // 测试环境API地址
  [ENV.PROD]: 'https://api.example.com'      // 生产环境API地址
};

// 是否使用模拟数据
const USE_MOCK = {
  [ENV.DEV]: false,   // 开发环境使用模拟数据
  [ENV.TEST]: false, // 测试环境不使用模拟数据
  [ENV.PROD]: false  // 生产环境不使用模拟数据
};

// 导出配置
export default {
  env: CURRENT_ENV,
  apiBaseUrl: API_BASE_URL[CURRENT_ENV],
  useMock: USE_MOCK[CURRENT_ENV],
  apiUrls: {
    test: '/test/',
    // 可以添加更多API端点
    user: '/user/',
    login: '/login/',
    master: '/master/xappmaster/?domain__in=menu_category&__mac=',
    menuItems: '/restaurant/xappmenu/menucategory/?category_group=', // 添加菜单项API端点
    // ...
  }
};