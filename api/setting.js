import request from './request.js'
import {
  baseUrl
} from './request.js'

class setting {
  constructor() {
    this._request = new request
    this._request.setErrorHandler(this.errorHander)

    this._baseUrl = baseUrl
    this._defaultHeader = {
      'Content-Type': 'application/json'
    }
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }


  /**
   * 获取所有课程
   */
  getInfomation(token) {
    let data = {
      token: token
    }
    return this._request.getRequest(this._baseUrl + '/api/user/getUserInfo', data).then(res => res.data)
  }
}
export default setting