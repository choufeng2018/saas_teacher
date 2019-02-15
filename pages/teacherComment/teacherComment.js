// pages/homeworkDetail/homeworkDetail.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')

Page({

  data: {
    // indicatorDots:true,
    // autoplay:true,
    interval:'3000',
    playing: false,
    endPlay: false,
    P_playing:false,
    P_endPlay:false,

      value: 0,
      percent: 0,
      max: 17,
      pass_time: '00:00',
      total_time: '00:00',
    current: 0,
    p_pass_time: '00:00',
  },
  changePic: function (e) {
    console.log(e.detail);
    this.setData({
      current: e.detail.current
    })
  },
  //预览图片
  preview: function (e) {
    var cur = e.currentTarget.dataset.cur;
    var pics = e.currentTarget.dataset.pic;
    // console.log(cur)
    // console.log(pics)
    //a = true;
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: pics // 需要预览的图片http链接列表
    })
  },
  toskip(e){
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../teacherSkip/teacherSkip?'+'id='+id,
    })
  },
  record(e){
    var pratice_id = e.currentTarget.dataset.pratice_id;
    var kpl_id = e.currentTarget.dataset.kpl_class_id;
    wx.navigateTo({
      url: '../banjiRecord/banjiRecord?' + 'pratice_id=' + pratice_id + '&kpl_class_id=' + kpl_id,
    })
  },
  async commentdetail(id){
    // /api/v1.practice/comment_detail
    var token = wx.getStorageSync('token');
    const data = await utils.get('practice/comment_detail', {
      comment_id: id
    }, token);
    if(data.code==1){
      this.setData({
        detail:data.data,
          total_time: data.data.audio_time,
          max: data.data.seconds
      })

      wx.hideLoading();
    }
  },
  piyue:function(){
    
  },
  playRec() {
    this.piyueAudio.pause();
    var audio = this.data.detail.audio;
    console.log('dianji')
    //const innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.src = audio;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.setData({
      playing: true,
      endPlay: false,
      P_playing:false,
      P_endPlay:false
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
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

  P_playRec() {
    this.innerAudioContext.pause();
    var audio = this.data.detail.comment.audio;
    console.log('dianji')
    //const innerAudioContext = wx.createInnerAudioContext();
    this.piyueAudio.autoplay = true;
    this.piyueAudio.src = audio;
    this.piyueAudio.play();
    this.piyueAudio.onPlay(() => {
      console.log('开始播放')
    })
    this.setData({
      P_playing: true,
      P_endPlay: false,
      playing:false,
      endPlay:false
    })
  },
  P_endPlay: function () {
    var that = this;

    this.piyueAudio.pause();

    //clearInterval(that.data.secs);
    this.setData({
      P_playStart: false,
      P_endPlay: true,
      P_playing: false
    })
  },
  P_contiunePlay: function () {
    this.piyueAudio.play();
    this.setData({
      P_playStart: false,
      P_endPlay: false,
      P_playing: true
    })
  },
  onLoad: function (options) {
      this.wxzxSlider = this.selectComponent("#wxzxSlider");
      wx.showLoading({
          title: '正在加载中',
      })

    var that=this;
    var id=options.id;
    this.setData({
      comment_id:id
    })
    this.commentdetail(id);

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
      console.log('jieshu');
      that.setData({
        playStart: false,
        endPlay: false,
        playing: false,

          value: 0,
          pass_time: '00:00',
          percent: 0,
      })
    })


    this.piyueAudio = wx.createInnerAudioContext();
    this.piyueAudio.onError((res) => {
      that.tip("播放录音失败！");
      that.setData({
       
        P_endPlay: true,
        P_playing: false
      })
    })

    this.piyueAudio.onEnded((res) => {
      console.log('jieshu');
      that.setData({
        P_endPlay: false,
        P_playing: false
      })
    })

    this.piyueAudio.onTimeUpdate(function () {
      // if (!that.wxzxSlider.properties.isMonitoring) {
      //   return
      // }
      var currentTime = that.piyueAudio.currentTime.toFixed(0);
      var sec = that.data.detail.comment.seconds;
      
      if (currentTime > that.data.detail.comment.seconds) {
        currentTime = that.data.detail.comment.seconds
      }

      var procs = (currentTime / sec) ;

      var pass_time = that.secondTransferTime(currentTime);
      //var progress = (init / 100000) * 100;
      

      that.setData({
        p_value: currentTime,
        p_pass_time: pass_time,
        p_percent: that.piyueAudio.buffered / that.piyueAudio.duration * 100,
        width:394*procs
      })
    })



  },
    // 点击slider时调用
    sliderTap: function (e) {
        console.log("sliderTap")
        this.seek()
    },

    // 开始滑动时
    sliderStart: function (e) {
        console.log("sliderStart")
    },

    // 正在滑动
    sliderChange: function (e) {
        console.log("sliderChange")
    },

    // 滑动结束
    sliderEnd: function (e) {
        console.log("sliderEnd")
        this.seek()
    },

    // 滑动取消 （左滑时滑到上一页面或电话等情况）
    sliderCancel: function (e) {
        console.log("sliderCancel")
        this.seek()
    },

    seek: function () {
        var value = this.wxzxSlider.properties.value
        console.log(value)
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


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var id = this.data.comment_id;
      var is_piyue = wx.getStorageSync('is_piyue');
      if (is_piyue==true){
          this.commentdetail(id);
      }

    this.setData({
      playing: false,
      endPlay: false,
      pass_time: '00:00',
      value: 0,
      P_playing: false,
      P_endPlay: false,
      p_pass_time:'00:00',
      p_value:0
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.innerAudioContext.stop();
    this.piyueAudio.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.stop();
    this.piyueAudio.stop();
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