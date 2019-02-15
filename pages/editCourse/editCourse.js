// pages/editCourse/editCourse.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldName:''
  },
  delate:function(){
    var token=wx.getStorageSync('token');
    var id = this.data.lesson_id;
    wx.request({
      url: baseUrl + '/api/lesson/delete_lesson',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded',
        token: token
      },
      data: {
       id:id
      },
      success: function (res) {
        if (res.data.code == 1) {
          
          wx.showToast({
            title: '删除成功',
            success:function(){
              wx.navigateBack({
                delta:1
              })
            }
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            image: '../../images/warn.png'
          })
        }

      }
    })
  },
  newName:function(e){
    var newName=e.detail.value;
    this.setData({
      oldName: newName
    })
  },
  newHour:function(e){
    var newHour = e.detail.value;
    this.setData({
      hour: newHour
    })
  },
  newPrice: function (e) {
    var newPrice = e.detail.value;
    this.setData({
      price: newPrice
    })
  },
  save:function(){
    var name=this.data.oldName;
    var token = wx.getStorageSync('token');
    var oldName = this.data.oldName;
    var lesson_id=this.data.lesson_id;
    var price=this.data.price;
    var hour=this.data.hour;
    var that = this;
    if (name==''||name===undefined){
      wx.showToast({
        title: '课程名不能为空',
        image:'../../images/warn.png'
      })
    }else{
      wx.request({
        url: baseUrl +'/api/lesson/edit_lesson',
        method: 'POST',
        header: {
          token: token
        },
        data: {
          id: lesson_id,
          name: oldName,
          hour:hour,
          price:price
        },
        success: function (res) {
          if(res.data.code==1){
            wx.showToast({
              title: res.data.msg,
              duration:1500,
              success:function(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 1500,
              icon:'none'
            })
          }
          
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var courseName = options.courseNmae;
    var hour = options.hour;
    var price = options.price;
    var lesson_id=options.id
    this.setData({
      oldName: courseName,
      lesson_id: lesson_id,
      price: price,
      hour:hour
    }) 
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