# 微信小程序示例项目

## 项目说明

这是一个微信小程序示例项目，展示了如何在小程序中进行网络请求，并处理各种网络场景。

## 网络请求功能

本项目实现了以下网络请求相关功能：

1. **封装的网络请求工具**：在 `utils/util.ts` 中提供了统一的网络请求接口
2. **环境配置管理**：在 `config/config.ts` 中集中管理不同环境的API地址
3. **模拟数据支持**：开发阶段可使用模拟数据，无需依赖后端接口
4. **错误处理机制**：统一处理网络错误，并提供友好的用户提示

## 如何使用

### 1. 配置环境

在 `config/config.ts` 文件中配置不同环境的API地址和是否使用模拟数据：

```typescript
// 当前环境
const CURRENT_ENV = ENV.DEV; // 可选值: ENV.DEV, ENV.TEST, ENV.PROD

// API基础URL配置
const API_BASE_URL = {
  [ENV.DEV]: 'http://192.168.0.185:8000',  // 开发环境API地址
  [ENV.TEST]: 'https://test-api.example.com', // 测试环境API地址
  [ENV.PROD]: 'https://api.example.com'      // 生产环境API地址
};

// 是否使用模拟数据
const USE_MOCK = {
  [ENV.DEV]: true,   // 开发环境使用模拟数据
  [ENV.TEST]: false, // 测试环境不使用模拟数据
  [ENV.PROD]: false  // 生产环境不使用模拟数据
};
```

### 2. 发起网络请求

在页面或组件中使用封装的请求函数：

```typescript
import { request } from '../../utils/util';
import config from '../../config/config';

// 发起请求
request({
  url: `${config.apiBaseUrl}${config.apiUrls.test}`,
  method: 'GET',
  useMock: config.useMock // 根据环境配置决定是否使用模拟数据
})
.then(res => {
  console.log('请求成功:', res.data);
  // 处理成功响应
})
.catch(err => {
  console.error('请求失败:', err);
  // 处理错误
});
```

### 3. 添加模拟数据

在 `utils/util.ts` 文件中的 `mockData` 对象中添加模拟数据：

```typescript
// 模拟数据
const mockData = {
  '/test': {
    status: 'success',
    data: {
      message: '这是模拟的API返回数据',
      timestamp: new Date().toISOString(),
      // 添加更多模拟数据...
    }
  },
  // 添加更多API路径的模拟数据
  '/user': {
    // 用户相关的模拟数据
  }
};
```

## 微信小程序网络请求注意事项

1. **域名限制**：
   - 小程序正式环境只能请求已在管理后台配置的域名
   - 域名必须是HTTPS，且有有效的SSL证书
   - 开发工具中可以临时关闭域名检查（不校验合法域名...）

2. **开发环境配置**：
   - 在 `project.config.json` 中设置 `"urlCheck": false` 可在开发环境中请求HTTP接口
   - 在开发者工具中勾选「不校验合法域名...」选项

3. **上线前检查**：
   - 确保所有API域名已在小程序管理后台配置
   - 确保API接口支持HTTPS
   - 将配置中的环境切换为生产环境 `CURRENT_ENV = ENV.PROD`
   - 关闭模拟数据功能 `USE_MOCK[ENV.PROD] = false`

## 常见问题

### 请求失败：域名未授权

出现 `request:fail url not in domain list` 错误时：

1. 检查是否使用了未授权的域名
2. 在开发环境中，可在开发者工具中勾选「不校验合法域名...」
3. 在生产环境中，必须在小程序管理后台添加对应的域名

### 请求超时

可在 `app.json` 中配置网络超时时间：

```json
"networkTimeout": {
  "request": 10000,
  "connectSocket": 10000,
  "uploadFile": 10000,
  "downloadFile": 10000
}
```