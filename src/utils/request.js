import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8080`,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加token等请求头
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 检查是否为二维码接口响应或图片响应
    const isQrCodeRequest = response.config.url.includes('/api/novel-publish/qrcode/');
    const contentType = response.headers['content-type'];
    const isImageResponse = contentType && contentType.startsWith('image/');

    // 如果是二维码请求或图片响应，直接返回原始响应（包含data和headers），不进行JSON解析和code检查
    if (isQrCodeRequest || isImageResponse) {
        return response; // 返回完整的response对象
    }

    // 对于其他响应，进行正常的JSON数据和code检查
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      // 抛出错误，以便调用方能在catch中处理，同时携带后端返回的可能有用信息
      const error = new Error(res.message || '请求失败');
      error.response = response; // 将原始响应附加到错误对象
      return Promise.reject(error);
    }
    return res // 返回res.data
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request 