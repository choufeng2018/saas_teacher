// pages/buyRecord/buyRecord.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuId:''
  },
  toDetail:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../recordDetail/recordDetail?'+'id='+id,
    })
  },
  get_order_list: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    var stuId = that.data.stuId;
    wx.request({
      url: baseUrl + '/api/backend.lesson_order/get_order_list',
      method: 'get',
      header: {
        token: token
      },
      data: {
        student_id: stuId,
        page: page,
        page_size: 10
     
      },
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res.data.data)
          that.setData({
            orderList: res.data.data.data
          })

          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  
  var that=this;
  wx.showLoading({
    title: '正在加载中',
  })

  that.setData({
    stuId:options.id
  })
  this.get_order_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})