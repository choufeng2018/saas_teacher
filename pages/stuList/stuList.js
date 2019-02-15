// pages/stuList/stuList.js
var token = wx.getStorageSync('token');
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    multi_choose:[],
    noResult:false
  },
  add: function () {
    wx.navigateTo({
      url: '../createStu/createStu',
    })
  },
  inpuName: function (e) {
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  searchName: function (e) {
    console.log(e.detail.value);
    var name = e.detail.value;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: baseUrl + '/api/student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: name
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          that.setData({
            items: res.data.data.data
          })
          wx.hideLoading();
        }
      }
    })
  },
  loadList: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: baseUrl + '/api/student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        page_size: 200,
      },
      success: function (res) {
        // var statu={"state":0}
        var list = res.data.data.data;
        var muti = that.data.multi_choose;
        //当选中学员后返回添加后
        if (muti.length != 0) {
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < muti.length; j++) {
              if (list[i].student_id == muti[j].id) {
                list[i].state = 1
              }
              //console.log(muti[j].attr_id)
            }
            //list[i].state=0;

          }
        }

        that.setData({
          items: list
        })
      }
    })
  },
  checks:function(e){
    var name=e.currentTarget.dataset.name;
    var id=e.currentTarget.dataset.id;
    var avatar= e.currentTarget.dataset.avatar;
    var index=e.currentTarget.dataset.index;
    var list = this.data.items;
    var token = wx.getStorageSync('token');
    
    // for (var j = 0; j < list.length; j++) {
    //   if (list[j].student_id == id) {
    //     list[j].state = 1
    //   }else{
    //     list[j].state = 0
    //   }
      
    // }

    // // console.log(list);
    // this.setData({
    //   items:list
    // })
    var multi_choose=[
      {
        username:name,
        id:id,
        avatar:avatar,
        state:1
      }
    ];

    wx.setStorageSync('addStu', multi_choose);
    wx.navigateBack({
      delta:1
    })

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList();

   
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
    var that=this;
    var muti = wx.getStorageSync('addStu');
    if (muti) {
      that.setData({
        multi_choose: muti
      })
    }
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