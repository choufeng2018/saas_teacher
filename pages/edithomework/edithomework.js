// pages/sendhomework/sendhomework.js
// const recorderManager = wx.getRecorderManager()
// const innerAudioContext = wx.createInnerAudioContext()
var voice = "";

let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxname: 20,
    maxtext: 1000,
    // currenttextNumber: 0,
    // currentWordNumber: 0,
    //requireTexts: '',
    playStart: false,
    endPlay: false,
    P_playStart: false,
    P_endPlay: false,
    pics: [],
    picboxs: [],
    tempFilePath: '',
    playing: false,
    P_playing: false,
    picboxs: [],
    src: '',
    hasDelate: false,
    pass_time: '00:00',
    total_time: '00:00',
    luyin: false,
    secs:'',
    upAudio:false,
    is_record:false,
    luyin:false
  },
  async getwork(p_id) {
    var token = wx.getStorageSync('token');
    const data = await utils.get('practice/detail', {
      
      practice_id: p_id,
     

    }, token);
    if (data.code == 1) {
      //var oldDetail = data.data;
      var that = this;
      var detail = data.data;
      console.log(detail)
      var currenttextNumber = parseInt(detail.desc.length)
      var currentWordNumber = parseInt(detail.title.length);
      if (detail.audio_time == '') {
        var max = 120000;
        var total = 120000;
      } else {
        var max = detail.seconds;
        var total = detail.audio_time;
      }
      this.setData({
        homeworkname: detail.title,
        requireTexts: detail.desc,
        // stuId: detail.student_list[index].student_id,
        // tid: detail.teacher_id,
        // sid: detail.id,
        work: detail,
        stu_name: detail.student_name,
        teacher_name: detail.username,
        currentWordNumber: currentWordNumber,
        currenttextNumber: currenttextNumber,
        pics: detail.pics,
        practice_id: detail.practice_id,
        total_time: total,
        src: detail.audio,
        max: max
      })
    }
  },
  MusicStart: function(e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var that = this
    that.setData({
      progress: progress
    })
  },
  workName(e) {
    var name = e.detail.value;
    var filterName = name.replace(/\s*/g, "");
    var len = parseInt(filterName.length);
    if (len > this.data.maxname) return;
    this.setData({
      currentWordNumber: len, //当前字数 
      homeworkname: filterName
    });

  },
  requireText(e) {
    var text = e.detail.value;
    var filterText = text.replace(/\s*/g, "")
    var len = parseInt(filterText.length);
    if (len > this.data.maxtext) return;
    this.setData({
      currenttextNumber: len, //当前字数  
      requireTexts: filterText
    });
  },
  playingAudio(e) {
    var audio = this.data.src;
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.src = audio;
    this.innerAudioContext.play();
    this.setData({
      playStart: true,
      playing: false,
      endPlay: false,
      //voice:voice
    })


  },
  endBofang: function() {
    this.innerAudioContext.pause();
    this.setData({
      playStart: false,
      endPlay: true,
      playing: false,
      P_playStart: false,
      P_endPlay: true,
      P_playing: false
    })
  },


  playRec: function() {
    var that = this;
    var init = 0;
    this.recorderManager.start({
      format: 'mp3',
      duration: 120000
    });


    this.setData({
      P_playStart: true,
      P_playing: false,
      P_endPlay: false,
      is_record:true
      //voice:voice
    })

  },
  endPlay: function() {
    this.recorderManager.stop();
    // recorderManager.onStop((res) => {
    //   this.tempFilePath = res.tempFilePath;
    //   console.log('停止录音', res.tempFilePath)
    //   const { tempFilePath } = res
    // })

    clearInterval(this.data.secs);

    this.setData({
      P_playStart: false,
      P_endPlay: true,
      P_playing: false
    })
  },
  tip: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  playVoice: function() {


    var that = this;
    var src = this.data.src;
    if (src == '') {
      this.tip("请先录音！")
      return;
    }
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.play()


    this.setData({
      playStart: false,
      playing: true,
      endPlay: false,
      P_playStart:false,
      P_endPlay:false,
      P_playing:true
    })
  },
  ups: function() {
    var pics = this.data.pics;
    this.uploadimg({
      url: baseUrl + 'common/upload',
      path: pics //这里是选取的图片的地址数组
    });
  },
  uploadimg: function(data) {
    wx.showLoading({
      title: '正在上传中'
    })
    var picboxs = [];
    var oldPic = this.data.picboxs;
    var that = this;
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        var Tojson = JSON.parse(resp.data);
        var that = this;
        if (Tojson.code == 1 || Tojson.code == 200) {

          var avatar = Tojson.data.url;
          var l = oldPic.concat(avatar);

          that.setData({
            picboxs: l
          })
          wx.hideLoading();
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        //console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          //console.log('成功：' + success + " 失败：" + fail);
          var id = that.data.practice_id;
          var homeworkname = that.data.homeworkname;
          var requireTexts = that.data.requireTexts;
          var src = that.data.src;
          var pic = that.data.picboxs;

          that.editwork(id, homeworkname, requireTexts, src, pic);
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  //本地传图
  uploads: function() {
    var that = this;
    var pics = this.data.pics;
    var picss = [];
    wx.chooseImage({
      count: 10 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;
        //console.log(imgsrc);

        var pic = pics.concat(imgsrc);
        //console.log(pic);

        picss.push(pic);

        that.setData({
          pics: pic
        });
      },
      fail: function() {},
      complete: function() {

      }
    })
  },

  //预览图片
  preview: function(e) {
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
  //删除图片
  close: function(e) {
    var index = e.currentTarget.dataset.index;
    // var picboxs = this.data.picboxs;
    var picboxs = this.data.pics;
    var newpic = picboxs.splice(index, 1);
    this.setData({
      pics: picboxs
    })
  },
  //删除录音
  delateRecord(e) {
    var that = this;
    var src = this.data.src;
    var play = this.data.playStart;

    if (play == true) {
      wx.showToast({
        title: '请您先关闭录音及播放状态',
        icon: 'none'
      })
      return false;
    }
    if (src == '') {
      wx.showToast({
        title: '暂无已保存录音',
        icon: 'none'
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '您确定要删除该录音吗',
      success: function(res) {
        if (res.confirm) {

          that.setData({
            src: '',
            luyin: true,
            pass_time: '00:00',
            P_playStart: false,
            total_time: '02:00',
            endPlay:true,
            playStart:true,
            playing:true,
            P_endPlay: false,
            P_playing: false,
            width: 0,
            value: 0,
            hasDelate: true
          })
        }
      }
    })
  },
  uploadAudio(audio) {
    var token = wx.getStorageSync('token');
    var that=this;

    wx.uploadFile({
      url: baseUrl + 'common/upload',
      filePath: audio,
      name: 'file',
      formData: {

      },
      success(res) {
        var toJson=JSON.parse(res.data);
        if (toJson.code == 1) {
          that.setData({
            src: toJson.data.url,
            upAudio:true
          })
        } else {
          wx.showToast({
            title: toJson.msg,
            icon:'none'
          })
        }

      }
    })
  },
  send: function() {
    var name = this.data.homeworkname;
    var text = this.data.requireTexts;
    var pics = this.data.pics;
    var audio = this.data.src;
    var that=this;

    var upAudio = that.data.upAudio;
    var is_record = that.data.is_record;
    var isRecording = this.data.P_playStart;

    if (isRecording == true) {
      wx.showToast({
        title: '正在录音中,请先关闭当前录音',
        icon: 'none'
      })

      return false
    }
    if (name == '') {
      wx.showToast({
        title: '作业名称不能为空',
        icon: 'none'
      })
    } else if (pics.length == 0) {
      wx.showToast({
        title: '图谱不能为空',
        icon: 'none'
      })
    } else if (is_record == true && upAudio == false) {
      wx.showToast({
        title: '音频正在上传中，请稍后再操作',
        icon: 'none'
      })
      return false;
    }
     else {
      this.ups();
    }
  },

  async editwork(id, title, desc, audio, pics) {
    var pic = this.data.pics;
    var old = [];
    for (var i = 0; i < pic.length; i++) {
      if (pic[i].indexOf('.com') != -1) {
        old.push(pic[i]);
      }
    }
    var newArr = old.concat(pics);
    var newpic = newArr.join(';');


    var token = wx.getStorageSync('token');
    const data = await utils.post('practice/edit', {
      practice_id: id,
      title: title,
      desc: desc,
      audio: audio,
      pics: newpic,
    }, token);

    if (data.code == 1) {
      wx.showToast({
        title: data.msg,
        success: function() {
          wx.showToast({
            title: '修改成功',
            success:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
          
        }
      })

      wx.setStorageSync('is_editWork', true)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.recorderManager = wx.getRecorderManager();
    this.wxzxSlider = this.selectComponent("#wxzxSlider");
    var p_id=options.pid;
    this.getwork(p_id);



   
    this.recorderManager.onError(function() {
      that.tip("录音失败！")
    });

    this.recorderManager.onStop(function(res) {
      that.setData({
        src: res.tempFilePath,
        P_playStart: false,
        P_endPlay: true,
        P_playing: false,
        is_record: true,
        playing:false,
        playStart:false,
        endPlay:false
      })
      that.tip("录音完成！");
      clearInterval(that.data.secs);
      that.uploadAudio(res.tempFilePath);
    });

    
    this.innerAudioContext = wx.createInnerAudioContext();

    this.innerAudioContext.onTimeUpdate(function() {
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

    var that = this;
    this.recorderManager.onStart(function (res) {
      var init = 0;
      that.data.secs = setInterval(function () {
        init++;
        var progress = (init / 120);
        if (init >= 60) {
          var secn = init % 60;
          var mi = Math.floor(init / 60);
          var inits = mi + ':' + secn;
        } else if (init < 60) {
          var s = Math.floor((init % 60)) < 10 ? '0' + Math.floor((init % 60)) : Math.floor((init % 60));
          var inits = '00' + ':' + s;
        }
        that.setData({
          pass_time: inits,
          progress: progress,
          width: 344 * progress
        })
      }, 1000)
    })



    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })

    this.innerAudioContext.onEnded((res) => {
      that.setData({
        playStart: false,
        endPlay: true,
        playing: false,
        P_playStart: false,
        P_endPlay: true,
        P_playing: false
      })
    })
  },
  // 点击slider时调用
  sliderTap: function(e) {
    this.seek()
  },

  // 开始滑动时
  sliderStart: function(e) {
    console.log("sliderStart")
  },

  // 正在滑动
  sliderChange: function(e) {
    console.log("sliderChange")
  },

  // 滑动结束
  sliderEnd: function(e) {
    console.log("sliderEnd")
    this.seek()
  },

  // 滑动取消 （左滑时滑到上一页面或电话等情况）
  sliderCancel: function(e) {
    console.log("sliderCancel")
    this.seek()
  },

  seek: function() {
    var value = this.wxzxSlider.properties.value
    console.log(value)
    var seek_time = value.toFixed(0);
    var pass_time = this.secondTransferTime(seek_time);
    this.setData({
      pass_time: pass_time,
    })
    this.innerAudioContext.seek(Number(seek_time));
  },
  secondTransferTime: function(time) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    this.setData({
      playStart: false,
      endPlay: true,
      playing: false,
      // pass_time: '00:00',
      // value: 0
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.innerAudioContext.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.innerAudioContext.pause();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})