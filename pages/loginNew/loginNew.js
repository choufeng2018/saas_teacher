// pages/loginNew/loginNew.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'../../images/avatar.png',
    name:''
  },
  avatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];

        var token = wx.getStorageSync('token');


        console.log(tempFilePaths);

        wx.uploadFile({
          url: baseUrl + 'common/upload',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            token: token
          },
          formData: {
            'file': tempFilePaths
          },
          success: function (res) {

            var Tojson = JSON.parse(res.data)
            if (Tojson.code == 1 || Tojson.code == 200) {
              console.log(Tojson.data.url)
              var avatar = Tojson.data.url;
              //that.changeInfo(avatar)
              that.setData({
                avatar: avatar
              })
            }
          }
        })


      }
    })
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  changeInfo: function (avatar,name) {
    var token = wx.getStorageSync('token');
    var that = this;
   
    wx.request({
      url: baseUrl + 'user/profile',
      method: 'post',
      header: {
        "Content-type": 'application/x-www-form-urlencoded',
        token: token
      },
      data: {
        avatar: avatar,
        username:name
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.setStorageSync('is_new', 0);
          wx.showToast({
            title: '操作成功',
            duration:1000,
            success:function(){
              wx.reLaunch({
                  url: '../stu/stu',
              })
            }
          })
    

        }
      }
    })
  },
  submit:function(){
    var avatar = this.data.avatar;
    var name = this.data.name;
    if (avatar =='../../images/avatar.png'){
      var avatar='';
    }
    if(name==''){
      wx.showToast({
        title: '用户名不能为空',
        icon:'none'
      })
    }else{
      this.changeInfo(avatar,name)
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