// pages/stuDetail/stuDetail.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
var page=1;
var c_page=1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    list: [
      {
        id: '0',
        title: '作业'
      },
      {
        id: '1',
        title: '课评'
      },
    ],
    selectedId: '0',
    scroll: true,
    fixed: false,
    height: 44,
    thd:'',
    page:1,
    page_size:10,
    hasMoreData: true,
    contentlist: [],
    vlist:[],
    commentList:[],
    menuShow: false
  },
    addWork:function(e){
        var sid =e.currentTarget.dataset.sid;
        wx.navigateTo({
            url: '../sendhomework/sendhomework?'+'sid='+sid,
        })
    },
  todetail:function(e){
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
          url: '../homeworkDetail/homeworkDetail?' + 'p_id=' + id,
      })
  },
    //预览图片
    preview: function (e) {
        var cur = e.currentTarget.dataset.cur;
        var pics = e.currentTarget.dataset.pic;
        //a = true;
        wx.previewImage({
            current: cur, // 当前显示图片的http链接
            urls: pics // 需要预览的图片http链接列表
        })
    },
  lessonDetail:function(e){
    var id=e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../paikeDetail/paikeDetail?'+'id='+id,
    })
  },
  recordDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../recordDetail/recordDetail?' + 'id=' + id,
    })
  },
  async getwork(id,page){
    // /api/v1.practice/practice_list
    //var sid = this.data.stuId;
    var that=this;

    var token = wx.getStorageSync('token');
    const data = await utils.get("practice/practice_list", {
      student_id: id,
      page: page,
      page_size: 10
    }, token);

    if(data.code==1){
      wx.hideLoading();
      //page++;
      var vlist = that.data.vlist;
      for (var i = 0; i < data.data.data.length; i++) {
        vlist.push(data.data.data[i]);
      }

      this.setData({
        workList:data.data.data,
        lists: data.data.data,
        vlist: vlist,
        has_more: data.data.has_more
      })
        wx.hideLoading();
    }

  },
  change: function (e) {
    var cur = e.detail.current;
    this.setData({
      selectedId: cur
    })
  },
  tabchange: function (e) {
    var cur = e.detail;
    this.setData({
      selectedId: cur
    })
    //this.getList(cur);
  },
  toRecord:function(){
    var stuId=this.data.stuId;
    wx.navigateTo({
      url: '../buyRecord/buyRecord?'+'id='+stuId,
    })
  },
  delateStu:function(e){
    var token = wx.getStorageSync('token');
    var stuId = this.data.thd;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '删除学员后学员信息不可恢复,您确定要删除该学员？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: baseUrl + 'student/delete_student',
            method: 'POST',
            header: {
              token: token
            },
            data: {
              student_id: stuId,
            },
            success: function (res) {
              if (res.data.code == 1) {
                
                wx.showToast({
                  title: res.data.msg,
                  icon:'none',
                  success: function () {
                    wx.navigateBack({
                      delta:1
                    })
                  }
                })

              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
              }
            }
          })
        }
      }
    })
   
  },
  acts: function () {
    var is_show = this.data.menuShow;
    if (is_show == false) {
      this.setData({
        menuShow: true
      })
    } else {
      this.setData({
        menuShow: false
      })
    }

  },
  toEdit:function(e){
    var old = e.currentTarget.dataset.detail;
    
    var thd = this.data.thd;
   
    var detail=JSON.stringify(old);
    

    
    // var username = e.currentTarget.dataset.username;
    // var avatar = e.currentTarget.dataset.avatar;
    // var mobile = e.currentTarget.dataset.mobile;
    // var gender = e.currentTarget.dataset.gender;
    // var birthday = e.currentTarget.dataset.birthday;
    // var learn_status = e.currentTarget.dataset.learn_status;
    // var status = e.currentTarget.dataset.status;
    // var sno = e.currentTarget.dataset.sno;
    // var remark = e.currentTarget.dataset.remark;
    wx.navigateTo({
      url: '../editStu/editStu?'+'thd='+thd,
    })
  },
  ///backend.lesson_order/get_order_list
  get_order_list:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    var stuId = that.data.stuId;
    var thd = that.data.thd;
    wx.request({
      url: baseUrl + 'backend.lesson_order/get_order_list',
      method: 'get',
      header: {
        token: token
      },
      data: {
        student_id: thd,
        page:page,
        page_size:200
      },
      success: function (res) {
        if (res.data.code == 1) {
          //console.log(res.data.data)
          that.setData({
            orderList: res.data.data.data
          })
          
        }
      }
    })
  },
  get_detail: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    var thd = that.data.thd;
    wx.request({
      url: baseUrl + 'student/get_detail',
      method: 'get',
      header: {
        token: token
      },
      data: {
        student_id: thd
      },

      success: function (res) {
        if (res.data.code == 1) {
          var birth=res.data.data.birthday;
          var age=utils.ages(birth);
          if (age==undefined || age==null){
            that.setData({
              detail: res.data.data,
              age: 0
            })
          }else{
            that.setData({
              detail: res.data.data,
              age: age
            })
          }
          

          //wx.hideLoading();
        }
      }
    })
  },
  preview: function (e) {
    var cur = e.currentTarget.dataset.cur;
    var pics = e.currentTarget.dataset.pic;
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: pics // 需要预览的图片http链接列表
    })
  },
  async getComment() {
    var that=this;
    var stuId=this.data.stuId;
    var thd = this.data.thd;
    var token = wx.getStorageSync('token');
    const data = await utils.get("shedule_comment/get_list", {
      student_id: thd,
      page:c_page,
      page_size:10
    },token);
    var commentList = that.data.commentList;
    for (var i = 0; i < data.data.data.length; i++) {
      commentList.push(data.data.data[i]);
    }


    this.setData({
      commentList: commentList,
      commentTotal: data.data.total
    })
  },
  async getLesson(page,page_size) {
    var stuId = this.data.stuId;
    var thd = this.data.thd;
    var token = wx.getStorageSync('token');
    
    var that=this;
    
    const data = await utils.get("shedule/get_lesson", {
      student_id: thd,
      page:page,
      page_size:page_size
    },token);
    if(data.code==1){
      var contentlistTem = that.data.contentlist;

      if (that.data.page == 1) {
        contentlistTem = []
      }

      var contentlist = data.data.data;
      // if (contentlist.length == 0) {
      //   this.setData({
      //     noResult: true
      //   })
      // }

      if (contentlist.length < that.data.page_size) {
        that.setData({
          contentlist: contentlistTem.concat(contentlist),
          hasMoreData: false
        })
      } else {
        that.setData({
          contentlist: contentlistTem.concat(contentlist),
          hasMoreData: true,
          page: that.data.page + 1
        })
      }

      // var lessonList = data.data.data;
      // this.setData({
      //   lessonList: lessonList
      // })
    }
    
  },
  toOrder:function(e){
    //var order_id=e.currentTarget.dataset.id;
    var order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../recordDetail/recordDetail?' + 'id=' + order_id,
    })
  },
  toBottom:function(){
    var that = this;

    var id = this.data.stuId;
   
    var has_more = this.data.has_more;
    if (has_more == true) {
      page++;
      this.getwork(id, page);
    }
  },
  commenttoBottom: function () {
    var that = this;
    var commentList = this.data.commentList;
    // var lists = this.data.lists;
    var commentTotal = this.data.commentTotal;
    if (commentList.length < commentTotal) {
      c_page++;
      this.getComment();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var clientHeight=wx.getSystemInfoSync().windowHeight;
    var that=this;
    var id=options.id;
    var thd=options.thd;
    var page = this.data.page;
    var page_size = this.data.page_size;
    wx.showLoading({
      title: '正在加载中',
    })
    this.setData({
      stuId:id,
      thd:thd,
      clientHeight: clientHeight
    })

    //this.get_detail();
    //this.get_order_list();
    
    //this.getLesson(page,page_size);
    var page=1;
    //this.getwork(id,page)
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
    page=1;
    c_page=1;
    var id = this.data.stuId;
    this.get_detail();
    this.getComment(c_page);
    this.getwork(id, page);
    this.setData({
      commentList:[],
      vlist:[],
      menuShow:false
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
    console.log('到底了')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})