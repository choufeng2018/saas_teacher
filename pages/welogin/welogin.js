// pages/welogin/welogin.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  userInfoHandler: function (res_data) {
    var that = this;
    var res = res_data.detail;
    var pageTitle=that.data.pageTitle;
    var loginUrl = that.data.loginUrl;
    // console.log(res_data);
    if (res.encryptedData == undefined) {
      return false;
    }
    //调用登录接口
    console.log(res);
    wx.login({
      success: function (e) {
        var app = getApp();
        app.globalData.userInfo = res.userInfo;
        wx.request({
          url: loginUrl,
          data: {
            "code": e.code, "encryptedData": res.encryptedData, "iv": res.iv, "platform": "wx-p"
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          }, // 设置请求的 header
          method: 'POST',
          dataType: '',
          success: function (res) {
            console.log(res.data.data);
            if (res.data.code == 200 || res.data.code==1) {
              //console.log(res.data.data.username)
              wx.setStorageSync('uid', res.data.data.id);
              wx.setStorageSync('avatar', res.data.data.avatar);
              wx.setStorageSync('username', res.data.data.username);
              wx.setStorageSync('mobile', res.data.data.mobile);
              wx.setStorageSync('open_id', res.data.data.open_id);
              if (pageTitle=='乐鸟音乐'){
                wx.setStorageSync('token', res.data.data.userinfo.token);
              }
              
              wx.showToast({
                title: '授权成功',
                duration:1500,
                success:function(){
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })

              

            } else {
              wx.showModal({
                title: '提示',
                content: '获取超时请重试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) { }
                }
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var locatPage=options.fromPage;
    if (locatPage =='friendMoment'){
      wx.setNavigationBarTitle({
        title: '乐鸟音乐',
      })
      that.setData({
        pageTitle:'乐鸟音乐',
        pageIcon:'../../images/icon.png',
        loginUrl: musicUrl + '/api/wechat/setinfo'
      })
    } else if (locatPage == undefined || locatPage == null || locatPage==''){
      wx.setNavigationBarTitle({
        title: '多彩蓓蕾',
      })
      that.setData({
        pageTitle: '多彩蓓蕾',
        pageIcon: '../../images/logo300.png',
        loginUrl: baseUrl + 'wechat/auth/setinfo'
      })
    }
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

  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://wx.igtclub.com/index.php/'
  }
})