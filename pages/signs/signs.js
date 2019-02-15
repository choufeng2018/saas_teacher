// pages/signs/signs.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
var page = 1;
var a;
Page({
  /**
   * 页面的初始数
   */
  data: {
    index: '',
    Tindex: '',
    list: [
      {
        id: '0',
        title: '签到'
      },
      {
        id: '1',
        title: '课评'
      }
    ],
    selectedId: '0',
    scroll: true,
    fixed: true,
    height: 44,
    date:'',
    showModel:false,
    videosrc:null,
    signList:[]
  },
  closeVideo:function(){
    this.setData({
      showModel: false
    })
  },
  showVideo:function(e){
    var src= e.currentTarget.dataset.src;
    this.setData({
      videosrc: src,
      showModel:true
    })
  },
  showV:function(){
    this.setData({
      showModel: true
    })
  },
  getlesson: function (page,date) {
    //var date = this.data.date;
    var token = wx.getStorageSync('token');
    var that = this;
    if (lessonId == undefined) {
      var lessonId = '';
    } else if (teacherId == undefined) {
      var teacherId = '';
    }
    wx.request({
      url: baseUrl + 'shedule/get_sign_lesson',
      method: 'get',
      header: {
        token: token
      },
      data: {
        date: date,
        is_today: 1,
        page: page,
        page_size:10,
        // lesson_id: lessonId,
        // teacher_id: teacherId
      },
      success: function (res) {
        if (res.data.code == 1) {
          var signList = that.data.signList;
          //console.log(res.data.data.data)
          for (var i = 0; i < res.data.data.data.length; i++) {
            signList.push(res.data.data.data[i]);
          }

          console.log(signList)
          //that.setCircles();



          that.setData({
            signList: signList,
            list: res.data.data.data,
            has_more: res.data.data.total
          })

          wx.hideLoading();
        }
      }
    })
  },
  toBottom: function () {
    console.log('daodidle')
    var that = this;

    var date = this.data.date;
  var list=this.data.signList.length;
    var has_more = this.data.has_more;
    if (list<has_more) {
      page++;
      this.getlesson(page, date);
    }
  },
  getNowFormatDate: function () {
    var token = wx.getStorageSync('token');
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    


    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var weekday = weekArray[new Date(currentdate).getDay()];
    var weekName = "星期" + weekday;
    
    this.setData({
      nowDate: currentdate,
      date: currentdate,
      weekName: weekName
    })

    //var currentdate='2018-12-06';
    this.getlesson(1,currentdate);
    //this.getcomment(currentdate);
    return currentdate;
  },
  change: function (e) {
    
    var cur = e.detail.current;
    this.setData({
      selectedId: cur
    })
    //this.getList(cur);
  },
  tabchange: function (e) {
    var cur = e.detail;
    this.setData({
      selectedId: cur
    })
    //this.getList(cur);
  },
  bindDateChange: function (e) {
    var lessonId = this.data.lessonId;
    var teacherId = this.data.teacherId;
    var date = e.detail.value;
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    var weekday = weekArray[new Date(date).getDay()];
    var weekName = "星期" + weekday;
    page=1;
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      date: e.detail.value,
      weekName: weekName,
      signList:[]
    })
    this.getlesson(1,date);
    
  },
  commentDateChange:function(e){
    var date = e.detail.value;
    this.setData({
      nowDate: e.detail.value
    })
    this.getcomment(date);
  },
  async getcomment() {
    var date=this.data.nowDate;
    var token = wx.getStorageSync('token');
    const data = await utils.get("shedule_comment/get_list", {
      date: date,
    },token);
   
    var commentList=data.data.data
    this.setData({
      commentList: commentList
    })
  },
  todetail: function (e) {
    var details = e.currentTarget.dataset.detail;

    var detail=JSON.stringify(details);
    var id=e.currentTarget.dataset.id;

    var lesson = e.currentTarget.dataset.lesson;
    var teacher_name = e.currentTarget.dataset.teacher_name;
    var teacher_id = e.currentTarget.dataset.teacher_id;
    var lesson_id = e.currentTarget.dataset.lesson_id;
    var date = e.currentTarget.dataset.date;

    var begin_time = e.currentTarget.dataset.begin_time;
    var end_time = e.currentTarget.dataset.end_time;
    var dec_num = e.currentTarget.dataset.dec_num;
    var mobile = e.currentTarget.dataset.mobile;
    var lesson = e.currentTarget.dataset.lesson;

    var oldStudent_list = e.currentTarget.dataset.student_list;

    var student_list = JSON.stringify(oldStudent_list)

    var lesson_count = e.currentTarget.dataset.lesson_count;

    wx.navigateTo({
      url: '../signDetail/signDetail?'+'&id='+id,
    })
  },
  
  refreshToken: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'token/refresh',
      method: 'POST',
      header: {
        token: token
      },
      data: {

      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.setStorageSync('token', res.data.data.token)
        } else if (res.data.code == 401) {
          wx.removeStorageSync('token');
          wx.showToast({
            title: 'token已失效，重新登录',
            duration: 1000,
            success: function () {
              wx.reLaunch({
                url: '../login/login',
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    //this.getNowFormatDate();
    //this.setCircle();


    wx.removeStorageSync('addStu')
    var token = wx.getStorageSync('token');
    var is_new = wx.getStorageSync('is_new')

    if (token) {
      this.refreshToken();
    }

    if (token == undefined || token == null || token == '') {
      wx.reLaunch({
        url: '../login/login',
      })
    }

    if (token && is_new == 1) {
      wx.reLaunch({
        url: '../loginNew/loginNew',
      })
    }
    
  },
  setCircles:function(){
    // 页面渲染完成
    console.log('hahah')
    var list = this.data.signList;
    console.log(list)
    for(var i=0;i<list.length;i++){
      //var rate = parseInt(list[i].sign_count) / parseInt(list[i].student_count);
      // var rate1 = Number(list[i].sign_count);
      // var rate2 = Number(list[i].student_count);
      var rate1 = 1;
      var rate2 =1;

      console.log(i)
      

      var cxt_arc= wx.createCanvasContext('canvasArc'+[i]);//创建并返回绘图上下文context对象。
      cxt_arc.setLineWidth(6);
      cxt_arc.setStrokeStyle('#d2d2d2');
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();//开始一个新的路径
      cxt_arc.arc(33, 33, 30, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径
      cxt_arc.stroke();//对当前路径进行描边

      cxt_arc.setLineWidth(6);
      cxt_arc.setStrokeStyle('#3ea6ff');
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();//开始一个新的路径
      cxt_arc.arc(33, 33, 30, -Math.PI * rate1 / rate2, Math.PI * rate1 / rate2, false);
      cxt_arc.stroke();//对当前路径进行描边
      cxt_arc.draw();
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
    if (a) {
      a = false;
      return;
    }
    page=1;
    //c_page=1;
    this.getNowFormatDate();
    var token = wx.getStorageSync('token');
    wx.removeStorageSync('courseval');
    this.setData({
      signList:[]
    })
    
   
    //this.getInfo();
    if (token == undefined || token == null || token == '') {
      wx.reLaunch({
        url: '../login/login',
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