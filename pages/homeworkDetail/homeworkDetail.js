// pages/homeworkDetail/homeworkDetail.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime');
var a;
Page({
  data: {
    playing: false,
    endPlay: false,
    // indicatorDots:true,
    // autoplay:true,
    interval: '4000',
    value: 0,
    percent: 0,
    max: 17,
    pass_time: '00:00',
    total_time: '00:00',
    currents: 0,
    edit: true,
    buttonClicked: false,
    menuShow: false
  },
  changePic: function (e) {
    //console.log(e.detail);
    this.setData({
      currents: e.detail.current
    })
  },
  //预览图片
  preview: function (e) {
    var cur = e.currentTarget.dataset.cur;
    var pics = e.currentTarget.dataset.pic;
    console.log(cur)
    console.log(pics)
    a = true;
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: pics // 需要预览的图片http链接列表
    })
  },
  async getwork(practice_id, p_id, sid) {
    var token = wx.getStorageSync('token');
    const data = await utils.get('practice/detail', {
      third_student_id: practice_id,
      practice_id: p_id,
      shedule_id: sid

    }, token);
    if (data.code == 1) {
      this.setData({
        detail: data.data,
        audio: data.data.audio,
        total_time: data.data.audio_time,
        max: data.data.seconds
      })
      wx.hideLoading();
    }
  },
  playRec() {
    var audio = this.data.audio;
    //const innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.src = audio;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {

    })
    this.setData({
      playing: true,
      endPlay: false,
    })
  },
  endPlay: function () {
    var that = this;

    this.innerAudioContext.pause();

    //clearInterval(that.data.secs);
    this.setData({
      playStart: false,
      endPlay: true,
      playing: false
    })
  },
  contiunePlay: function () {
    this.innerAudioContext.play();
    this.setData({
      playStart: false,
      endPlay: false,
      playing: true
    })
  },
  async isLock(practice_id) {
    var token = wx.getStorageSync('token');
    var that = this;
    const data = await utils.get('practice/get_practice_class_status', {
      practice_id: practice_id,
    }, token);
    if (data.code == 1) {
      //console.log(detail);

      that.setData({
        edit: true,
        menuShow: true
      })
      // wx.navigateTo({
      //   url: '../edithomework/edithomework?' + 'detail=' + detail,
      // })
    } else if (data.code == 0) {
      wx.showToast({
        title: data.msg,
        icon: 'none'
      })
    }
  },
  toEdit(e) {
    // var old = e.currentTarget.dataset.detail;
    // var detail = JSON.stringify(old);
    var pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../edithomework/edithomework?' + 'pid=' + pid,
    })

  },
  edit(e) {
    var that = this;
    var edit = this.data.edit;
    utils.click(this);
    if (edit == true) {
      this.setData({
        edit: false
      })
      //return;
    } else {
      return;
    }
    var practice_id = this.data.detail.practice_id;
    this.isLock(practice_id);
    return;



  },
  toComment(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../teacherComment/teacherComment?' + 'id=' + id,
    })
  },
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  onLoad: function (options) {
    //const innerAudioContext = wx.createInnerAudioContext()
    //console.log(innerAudioContext);
    this.wxzxSlider = this.selectComponent("#wxzxSlider");
    wx.showLoading({
      title: '正在加载中',
    })
    var that = this;
    if (options.pid) {
      var pid = options.pid;
      var sid = options.sid
    } else {
      var pid = '';
      var sid = ''
    }

    if (options.p_id) {
      var p_id = options.p_id;
      var sid = ''
    } else {
      var p_id = ''
    }

    this.setData({
      pid: pid,
      p_id: p_id,
      sid: options.sid
    })
    this.getwork(pid, p_id, sid);

    //this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！");
      that.setData({
        playStart: false,
        endPlay: true,
        playing: false
      })
    })

    this.innerAudioContext.onTimeUpdate(function () {
      if (!that.wxzxSlider.properties.isMonitoring) {
        return
      }
      var currentTime = that.innerAudioContext.currentTime.toFixed(0);
      if (currentTime > that.data.max) {
        currentTime = that.data.max;
      }
      var pass_time = that.secondTransferTime(currentTime);
      that.setData({
        value: currentTime,
        pass_time: pass_time,
        percent: that.innerAudioContext.buffered / that.innerAudioContext.duration * 100,
        disabled: false
      })
    })

    this.innerAudioContext.onEnded((res) => {
      //console.log('jieshu');
      that.setData({
        playStart: false,
        endPlay: false,
        playing: false,

        value: 0,
        pass_time: '00:00',
        percent: 0,
      })
    })

  },
  // 点击slider时调用
  sliderTap: function (e) {
    //console.log("sliderTap")
    this.seek()
  },

  // 开始滑动时
  sliderStart: function (e) {
    //console.log("sliderStart")
  },

  // 正在滑动
  sliderChange: function (e) {
    //console.log("sliderChange")
  },

  // 滑动结束
  sliderEnd: function (e) {
    //console.log("sliderEnd")
    this.seek()
  },

  // 滑动取消 （左滑时滑到上一页面或电话等情况）
  sliderCancel: function (e) {
    //console.log("sliderCancel")
    this.seek()
  },

  seek: function () {
    var value = this.wxzxSlider.properties.value
    //console.log(value)
    var seek_time = value.toFixed(0);
    var pass_time = this.secondTransferTime(seek_time);
    this.setData({
      pass_time: pass_time,
    })
    this.innerAudioContext.seek(Number(seek_time));
  },
  secondTransferTime: function (time) {
    if (time > 3600) {
      return [
        parseInt(time / 60 / 60),
        parseInt(time / 60 % 60),
        parseInt(time % 60)
      ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    } else {
      return [
        parseInt(time / 60 % 60),
        parseInt(time % 60)
      ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    }
  },
  menu:function(){
    this.setData({
      menuShow:false
    })
  },
  delateWork(e){
    


  },
  delateWork(e) {
    var pid = e.currentTarget.dataset.pid;
   var that=this;
    wx.showModal({
      title: '重要提示',
      content: '删除作业后不可恢复，您是否确认删除？',
      success:function(res){
        if(res.confirm){
          that.delateAct(pid)
        }else{
          that.setData({
            menuShow:false
          })
        }
      }
    })


    
  },
  async delateAct(pid) {
    var token = wx.getStorageSync('token');
    const data = await utils.get('practice/delete_practice', {
      practice_id: pid,
    }, token);
    if (data.code == 1) {
      wx.showToast({
        title: data.msg,
        icon: 'none',
        duration: 1500,
        success: function () {
          wx.navigateBack({
            dela: 1
          })
        }
      })
    } else {
      wx.showToast({
        title: data.msg,
        icon: 'none'
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
    //console.log('show')
    if (a) {
      a = false;
      return;
    }

    this.setData({
      playing: false,
      endPlay: false,
      pass_time: '00:00',
      value: 0,
      currents: 0,
      menuShow:false
    })


    var pid = this.data.pid;
    var p_id = this.data.p_id;
    var sid = this.data.sid;
    var is_fresh = wx.getStorageSync('is_editWork');
    if (is_fresh == true) {
      this.getwork(pid, p_id, sid);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.innerAudioContext.stop();
    wx.removeStorageSync('is_editWork')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.stop();
    wx.removeStorageSync('is_editWork')
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