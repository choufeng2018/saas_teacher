import request from './request.js'
var re=require('./request.js')

class arrange {
  constructor() {
    this._baseUrl = re.baseUrl
    this._defaultHeader = {
      'Content-Type': 'application/json'
    }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
    
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 查询所有新闻列表
   */
  getNews(page, size ) {
    let data = {
      page: page,
      size: size
    }
    return this._request.getRequest(this._baseUrl + 'news/client', data).then(res => res.data)
  }

  /**
   * 获取所有课程
   */
  getList(page, page_size) {
    let data = {
      page: page,
      page_size: page_size
    }
    return this._request.getRequest(this._baseUrl + '/api/backend.practice/get_list', data).then(res => res.data)
  }
}
export default arrange