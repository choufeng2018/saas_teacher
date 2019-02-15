// pages/stuRank/stuRank.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rank:[
      {
        id:1,
        name:'1级'
      },
      {
        id: 1,
        name: '2级'
      },
      {
        id: 1,
        name: '3级'
      },
      {
        id: 1,
        name: '4级'
      }
    ]
  },
  toBack:function(e){
    var rankName=e.currentTarget.dataset.name;
    var rankId = e.currentTarget.dataset.id;
    wx.setStorageSync('rankName', rankName)
    wx.setStorageSync('rankId', rankId)
    wx.navigateBack({
      delta: 1
    })
  },
  addStuRank:function(){
    wx.navigateTo({
      url: '../addStuRank/addStuRank',
    })
  },
  get_rank_list: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + '/api/backend.user_level/get_list',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
      },
      success: function (res) {
        if (res.data.code == 1) {
    
          that.setData({
            list: res.data.data
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
    this.get_rank_list();
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