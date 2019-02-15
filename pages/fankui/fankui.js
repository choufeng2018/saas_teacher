// pages/fankui/fankui.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  feed:function(ad){
    var token = wx.getStorageSync('token');
    var mobile=wx.getStorageSync('pho');
    wx.request({
      url: baseUrl + '/api/feed_back/add',
      method: 'POST',
      data: { "contact": mobile, content:ad,from:1},
      header: {
        token: token
      },
      success: function (res) {
        if (res.data.code == 200 || res.data.code == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        
        // console.log(res.data);

      }, fail: function () {

      }
    })
  },
  advise:function(e){
    this.setData({
      advises:e.detail.value
    })
  },
  submit(){
    var ad=this.data.advises;
    if(ad==''|| ad==undefined){
      wx.showToast({
        title: '意见不能为空',
        icon:'none'
      })
    }else{
      this.feed(ad);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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