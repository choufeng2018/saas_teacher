// pages/teacher/teacher.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page=1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vlist:[],
    delBtnWidth: 120,
    startX: "",
    noResult:false
  },
  initEleWidth: function () {
    
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  touchS: function (e) {
    console.log('touchS');
    var status = e.currentTarget.dataset.teacher_status;
    if(status==1){
      this.data.delBtnWidth=120;
    }else{
      this.data.delBtnWidth = 60;
    }
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    console.log('touchM')
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.teacherList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        teacherList: list
      });
    }
  },
  touchE: function (e) {
    console.log('touchE')
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.teacherList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        teacherList: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  delated: function (tId) {
    // /api/teacher / del
    var token = wx.getStorageSync('token');
    //var teacherId = this.data.teacherId;
    wx.request({
      url: baseUrl + '/api/teacher/del',
      method: 'post',
      data: {
        id: tId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: token
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '删除成功',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  delItem: function (e) {
    var tId=e.currentTarget.dataset.id;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '删除该老师将无法使用相关功能,是否确认删除？',
      success:function(res){
        if(res.confirm){
          that.delated(tId);
        }
      }
    })
  },
  cancel:function(e){
    var tId=e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    //var teacherId = this.data.teacherId;
    var that=this;
    wx.request({
      url: baseUrl + '/api/teacher/add',
      method: 'post',
      data: {
        third_id: tId,
        do_type:3
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: token
      },

      success: function (res) {
        if (res.data.code == 1) {
          that.getTeacherList('');
          wx.showToast({
            title: '撤销成功',
          })
          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    
  },
  invite: function (e) {
    var tId = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    //var teacherId = this.data.teacherId;
    wx.request({
      url: baseUrl + '/api/teacher/add',
      method: 'post',
      data: {
        third_id: tId,
        do_type: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: token
      },
      success: function (res) {
        if (res.data.code == 1) {
          this.getTeacherList('');
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  delateTeacher:function(){
    wx.navigateTo({
      url: '../hasDelateTeacher/hasDelateTeacher',
    })
  },
  searchName: function (e) {
    var name = e.detail.value;
    this.getTeacherList(name);
  },
  getTeacherList: function (username) {
    var token = wx.getStorageSync('token');
    var that = this;
   
    wx.request({
      url: baseUrl + '/api/teacher/get_list',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: username,
        page_size:160,
        type: 3
      },
      success: function (res) {
        if(res.data.code==1){
          wx.hideNavigationBarLoading();
          that.setData({
            teacherList: res.data.data.data,
            teacher: res.data.data
          })
          if (username != '' && res.data.data.data.length==0){
            that.setData({
              noResult:true
            })
          }else{
            that.setData({
              noResult: false
            })
          }
        }
        
      }
    })
  },
  addTeacher:function(){
    wx.navigateTo({
      url: '../addTeacher/addTeacher',
    })
  },
  toEdit:function(e){
    var teacherId=e.currentTarget.dataset.id;
    var username=e.currentTarget.dataset.username;
    var phone=e.currentTarget.dataset.phone;
    var power=e.currentTarget.dataset.power;
    var status=e.currentTarget.dataset.teacher_status;
    //console.log(power)
    var newPower = JSON.stringify(power);
    if (status!=0){
      wx.navigateTo({
        url: '../editTeacher/editTeacher?' + 'teacherId=' + teacherId + '&username=' + username + '&phone=' + phone + '&power=' + newPower + '&status=' + status,
      })
    }
    
  },
  back:function(){
    this.getTeacherList('');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTeacherList('');
    wx.showNavigationBarLoading();
    this.initEleWidth();
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
    this.getTeacherList('');
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
    // var vlist = this.data.vlist;
    // var list = this.data.teacherList;
    // if (vlist.length % 20 == 0 && list != 0) {
    //   page++;
    //   this.getTeacherList(page);
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})