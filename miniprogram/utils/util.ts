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
  }
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
