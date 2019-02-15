// pages/signs/signs.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
import initCalendar from '../../component/calendar/main.js';
var page = 1;
var c_page=1;
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
        title: '作业'
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
    vlist: [],
    commentList:[],
    showDate:false,
  },
  toBottom:function(){
    var that=this;
    
    var date=this.data.date;
    var vlist = this.data.vlist;
    var lists = this.data.lists;
    var has_more = this.data.has_more;
    if (has_more==true) {
      page++;
      this.getwork(page, date);
    }
  },
  commenttoBottom:function(){
    console.log('daodi');
    var that = this;

    var date = this.data.nowDate;
    var commentList = this.data.commentList;
    // var lists = this.data.lists;
    var commentTotal = this.data.commentTotal;
    if (commentList.length<commentTotal) {
      c_page++;
      this.getcomment(page, date);
    }
  },
  toworkdetail(e){
    var id= e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail?'+'p_id='+id,
    })
  },
  async getwork(page,date) {
    // /api/v1.practice/practice_list
    //var sid = this.data.stuId;
    var that=this;

    var token = wx.getStorageSync('token');
    const data = await utils.get("practice/practice_list", {
      date: date,
      page: page,
      page_size: 3
    }, token);

    if (data.code == 1) {
      wx.hideLoading();
      page++;
      var vlist = that.data.vlist;
      for (var i = 0; i < data.data.data.length; i++) {
        vlist.push(data.data.data[i]);
      }


      this.setData({
        workList: data.data.data,
        lists: data.data.data,
        vlist: vlist,
        has_more: data.data.has_more
      })
    }

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
  getlesson: function (date) {
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
        // lesson_id: lessonId,
        // teacher_id: teacherId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            signList: res.data.data.data
          })

          wx.hideLoading();
        }
      }
    })
  },
  getNowFormatDate: function () {
    var token = wx.getStorageSync('token');
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
    
    this.setData({
      nowDate: currentdate,
      date: currentdate
    })
    //this.getlesson(currentdate);
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
    page=1;
    var date = e.detail.value;
    this.setData({
      date: e.detail.value,
      vlist:[]
    })
    this.getwork(1,date);
    //this.getlesson(date,1);
  },
  commentDateChange:function(e){
    var date = e.detail.value;
    c_page=1;
    this.setData({
      nowDate: e.detail.value,
      commentList:[]
    })
    this.getcomment(date);
  },
  async getcomment() {
    var date=this.data.nowDate;
    var token = wx.getStorageSync('token');
    var that = this;
    const data = await utils.get("shedule_comment/get_list", {
      date: date,
      page:c_page,
      page_size:10
    },token);
   
    //var commentList=data.data.data;

    var commentList = that.data.commentList;
    console.log(data.data.data)
    for (var i = 0; i < data.data.data.length; i++) {
      commentList.push(data.data.data[i]);
    }


    this.setData({
      commentList: commentList,
      commentTotal:data.data.total
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
  preview:function(e){
    var cur=e.currentTarget.dataset.cur;
    var pics=e.currentTarget.dataset.pic;
    // console.log(cur)
    // console.log(pics)
    a=true;
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: pics // 需要预览的图片http链接列表
    })
  },
  timer:function(){
    page=1;
    this.setData({
      showDate:true
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
    //this.getNowFormatDate();
    //this.getwork(1, '');
    //this.setCircle();
    // wx.getSystemInfo({
    //   success: function (res) {
    //     let clientHeight = res.windowHeight;
    //     let clientWidth = res.windowWidth;
    //     let ratio = 750 / clientWidth;
    //     let height = clientHeight * ratio;
    //     that.setData({
    //       height: height
    //     });
    //   }
    // })
    
  },
  setCircles:function(){
    // 页面渲染完成
    var cxt_arc = wx.createCanvasContext('canvasArc1');//创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径
    cxt_arc.arc(40, 40, 35, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径
    cxt_arc.stroke();//对当前路径进行描边

    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径
    cxt_arc.arc(40, 40, 35, -Math.PI * 1 / 8, Math.PI * 1 / 8, false);
    cxt_arc.stroke();//对当前路径进行描边

    cxt_arc.draw();
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
    c_page=1;
    //this.getNowFormatDate();
    initCalendar();
    this.getwork(1, '');
    this.setData({
      vlist:[],
      date:''
    })
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