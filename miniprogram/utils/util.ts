export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

// 网络请求封装
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  useMock?: boolean; // 是否使用模拟数据
}

interface RequestResult {
  success: boolean;
  data: any;
  message?: string;
}

// 模拟数据
const mockData = {
  '/test': {
    status: 'success',
    data: {
      message: '这是模拟的API返回数据',
      timestamp: new Date().toISOString(),
      list: [1, 2, 3, 4, 5],
      user: {
        name: '测试用户',
        id: 12345
      }
    }
  },
  '/master': [
    {"id":30,"name":"おすすめ","display_name":"おすすめ","domain":"menu_category","master_data":[{"id":124,"code":0,"name":"おすすめ","display_name":"おすすめ","display_order":0,"theme_id":"menu-top2","menu_count":14,"note":null,"extend":null,"option":null,"group":30}],"display_order":0,"extend":null,"option":{"img":""},"enabled":0},
    {"id":73,"name":"料理","display_name":"料理","domain":"menu_category","master_data":[{"id":264,"code":0,"name":"前菜","display_name":"前菜","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":263,"code":0,"name":"餃子","display_name":"餃子","display_order":2,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":265,"code":0,"name":"肉類","display_name":"肉類","display_order":3,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":267,"code":0,"name":"海鮮","display_name":"海鮮","display_order":4,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":266,"code":0,"name":"野菜類","display_name":"野菜類","display_order":5,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":305,"code":0,"name":"スープ類","display_name":"スープ類","display_order":6,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":303,"code":0,"name":"麺類","display_name":"麺類","display_order":7,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":304,"code":0,"name":"ご飯類","display_name":"ご飯類","display_order":8,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":306,"code":0,"name":"点心類","display_name":"点心類","display_order":9,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":268,"code":0,"name":"デザート","display_name":"デザート","display_order":10,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73},{"id":315,"code":1,"name":"持ち帰りメニュー","display_name":"持ち帰りメニュー","display_order":12,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":73}],"display_order":1,"extend":null,"option":{"img":"","show_time":[0,24]},"enabled":1},
    {"id":74,"name":"お酒","display_name":"飲み物","domain":"menu_category","master_data":[{"id":269,"code":0,"name":"ハイボール\nビール\nホッピー","display_name":"ハイボール\nビール\nホッピー","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":274,"code":0,"name":"焼酎","display_name":"焼酎","display_order":2,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":270,"code":0,"name":"サワー","display_name":"サワー","display_order":3,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":275,"code":0,"name":"日本酒","display_name":"日本酒","display_order":4,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":271,"code":0,"name":"カクテル","display_name":"カクテル","display_order":5,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":272,"code":0,"name":"果実酒","display_name":"果実酒","display_order":6,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":273,"code":0,"name":"ワイン","display_name":"ワイン","display_order":7,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":276,"code":0,"name":"紹興酒","display_name":"紹興酒","display_order":8,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":286,"code":1,"name":"ソフトドリンク","display_name":"ソフトドリンク","display_order":9,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74},{"id":287,"code":2,"name":"フロート","display_name":"フロート","display_order":9,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":74}],"display_order":2,"extend":null,"option":{"img":"","show_time":[0,21]},"enabled":1},
    {"id":81,"name":"テスト","display_name":"テスト","domain":"menu_category","master_data":[],"display_order":2,"extend":null,"option":{"display":false},"enabled":1},
    {"id":77,"name":"食べ飲み放題メニュー","display_name":"食べ飲み放題","domain":"menu_category","master_data":[{"id":288,"code":1,"name":"前菜","display_name":"食べ放題メニュー","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":77},{"id":289,"code":2,"name":"飲み放題メニュー","display_name":"飲み放題メニュー","display_order":2,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":77}],"display_order":3,"extend":null,"option":{"img":"","show_time":[0,24]},"enabled":1},
    {"id":79,"name":"ランチ","display_name":"ランチ","domain":"menu_category","master_data":[{"id":309,"code":1,"name":"ランチ定食","display_name":"ランチ定食","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":79}],"display_order":4,"extend":null,"option":{"img":"","show_time":[12,18]},"enabled":1},
    {"id":80,"name":"お酒セット560円","display_name":"お酒セット560円","domain":"menu_category","master_data":[{"id":314,"code":1,"name":"お酒セット","display_name":"お酒セット","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":80}],"display_order":6,"extend":null,"option":{"img":"","show_time":[0,24]},"enabled":1},
    {"id":11,"name":"menu_category_standard","display_name":" キャチン","domain":"menu_category","master_data":[{"id":232,"code":1,"name":"厨房","display_name":"厨房","display_order":1,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":11},{"id":233,"code":2,"name":"スタッフ","display_name":"スタッフ","display_order":2,"theme_id":"default","menu_count":9,"note":null,"extend":null,"option":null,"group":11}],"display_order":99,"extend":null,"option":{"img":""},"enabled":1}
  ]
};

// 请求函数
export const request = (options: RequestOptions): Promise<RequestResult> => {
  // 显示加载中
  wx.showLoading({ title: '加载中' });
  
  // 记录请求日志
  console.log(`[API请求] ${options.method || 'GET'} ${options.url}`, 
    options.useMock ? '[使用模拟数据]' : '', 
    options.data || '');
  
  return new Promise((resolve, reject) => {
    // 如果启用了模拟数据
    if (options.useMock) {
      // 从URL中提取路径
      const pathSegments = options.url.split('/');
      const path = pathSegments[pathSegments.length - 2] || pathSegments[pathSegments.length - 1] || '';
      const mockPath = `/${path.replace(/\?.*$/, '')}`; // 移除查询参数
      
      console.log('[模拟数据] 路径:', mockPath);
      
      // 延迟返回模拟数据
      setTimeout(() => {
        wx.hideLoading();
        if (mockData[mockPath]) {
          console.log('[模拟数据] 返回:', mockData[mockPath]);
          resolve({
            success: true,
            data: mockData[mockPath]
          });
        } else {
          console.warn('[模拟数据] 未找到对应路径:', mockPath);
          // 尝试使用通用模拟数据
          resolve({
            success: true,
            data: {
              status: 'success',
              message: '通用模拟数据',
              requestPath: mockPath,
              timestamp: new Date().toISOString(),
              data: {}
            }
          });
        }
      }, 500);
      return;
    }
    
    // 真实请求
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: options.header || {
        'content-type': 'application/json'
      },
      success: (res: any) => {
        console.log(`[API响应] ${options.url}`, res.statusCode, res.data);
        
        // 检查HTTP状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            data: res.data
          });
        } else {
          // HTTP错误
          console.error(`[API错误] HTTP状态码: ${res.statusCode}`, res.data);
          reject({
            success: false,
            message: `请求失败: HTTP ${res.statusCode}`,
            data: res.data
          });
          
          // 显示错误提示
          wx.showToast({
            title: `请求失败: ${res.statusCode}`,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err: any) => {
        console.error('[API错误]', err);
        reject({
          success: false,
          message: err.errMsg,
          data: null
        });
        
        // 网络错误提示
        let errorMsg = '网络请求失败';
        if (err.errMsg.includes('timeout')) {
          errorMsg = '请求超时';
        } else if (err.errMsg.includes('domain')) {
          errorMsg = '域名未授权';
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  });
};

// 处理菜单图片URL
export const formatImageUrl = (imageUrl: string) => {
  if (!imageUrl) return ''; // 如果没有图片URL，返回空字符串
  
  // 如果已经是完整URL（以http或https开头），直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return encodeURI(imageUrl); // 确保URL编码正确
  }
  
  // 如果是相对路径，构建完整URL
  // 假设格式为：menu_images/31.jpg?2025-06-23 07:31:16.155087
  const baseUrl = 'https://foodlifebucket.s3-ap-northeast-1.amazonaws.com/';
  
  
  return encodeURI(`${baseUrl}${imageUrl}`);
};
