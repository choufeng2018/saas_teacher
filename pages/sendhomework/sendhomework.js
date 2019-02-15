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
    max: 20,
    maxtext: 1000,
    currenttextNumber: 0,
    currentWordNumber: 0,
    requireTexts: '',
    playStart: false,
    endPlay: false,
    pics: [],
    picboxs: [],
    tempFilePath: '',
    playing: false,
    picboxs: [],
    src: '',
    sec: '00:00',
    is_load: false,
    upAudio:false,
    is_record:false
  },
  MusicStart: function(e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var that = this
    that.setData({
      progress: progress
    })
    console.log('音乐播放进度为' + progress + '%')
  },
  workName(e) {
    var name = e.detail.value;
    var filterName = name.replace(/\s*/g, "");
    var len = parseInt(filterName.length);
    console.log(len);
    if (len > this.data.max) return;
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
  playRec: function() {
    var that = this;

    this.recorderManager.start({
      format: 'mp3',
      duration: 120000
    });


    this.setData({
      playStart: true,
      playing: false,
      endPlay: false,
      //voice:voice
    })




  },
  endPlay: function() {
    var that = this;
    this.recorderManager.stop();
    this.innerAudioContext.pause()
    //this.recorderManager.pause();
    // recorderManager.onStop((res) => {
    //   this.tempFilePath = res.tempFilePath;
    //   console.log('停止录音', res.tempFilePath)
    //   const { tempFilePath } = res
    // })
    clearInterval(that.data.secs);
    this.setData({
      playStart: false,
      endPlay: true,
      playing: false
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
          console.log('上传中')
        }


        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          var stuId = that.data.stuId;
          var tid = that.data.tid;
          var homeworkname = that.data.homeworkname;
          var requireTexts = that.data.requireTexts;
          var src = that.data.src;
          var pic = that.data.picboxs;
          var pics = pic.join(';');
          var sid = that.data.sid;
          
         
          that.sendwork(stuId, tid, homeworkname, requireTexts, src, pics, sid);
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
    wx.chooseImage({
      count: 10 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });


        //that.ups();

      },
      fail: function() {
        // fail
      },
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
    a = true;

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
    console.log(newpic)
    console.log(picboxs)
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
        title: '请您先关闭录音状态',
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
            sec: '00:00',
            playStart: false,
            endPlay: false,
            playing: false,
            width: 0
          })
        }
      }
    })
  },
  uploadAudio(audio) {
    var token = wx.getStorageSync('token')
    var that = this;
    this.setData({
      upAudio:false
    })
    wx.uploadFile({
      url: baseUrl + 'common/upload',
      filePath: audio,
      name: 'file',
      formData: {

      },
      success(res) {
        console.log(res.data);
        var Tojson = JSON.parse(res.data);
        if (Tojson.code == 1) {
          that.setData({
            src: Tojson.data.url,
            upAudio:true
          })
        } else {

        }

      }
    })
  },
  send: function() {
    var name = this.data.homeworkname;
    var text = this.data.requireTexts;
    var pics = this.data.pics;
    var audio = this.data.src;
    var isRecording = this.data.playStart;
    var that=this;
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

      return false;
    }

    if (pics.length == 0) {
      wx.showToast({
        title: '请您上传曲谱',
        icon: 'none'
      })

      return false;
    }

    var upAudio = that.data.upAudio;
    var is_record = that.data.is_record;

    if (is_record == true && upAudio==false ) {
      wx.showToast({
        title: '音频正在上传中，请稍后再操作',
        icon:'none'
      })
      return false;
    }

    console.log(upAudio)

    console.log('请求')
    this.setData({
      is_load: true
    })

    this.ups();


  },

  async sendwork(stuId, tid, title, desc, audio, pics, sid) {
    var token = wx.getStorageSync('token');
    console.log(title);
    var that = this;
    //return false;
    const data = await utils.post('practice/add', {
      student_id: stuId,
      teacher_id: tid,
      title: title,
      desc: desc,
      audio: audio,
      pics: pics,
      shedule_id: sid
    }, token);

    if (data.code == 1) {
      that.setData({
        is_load: true
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: data.msg,
        icon: 'none'
      })
      setTimeout(function() {
        that.setData({
          is_load: false
        })
      }, 3000)
    }
  },
  endPlays() {
    this.innerAudioContext.pause();
    this.setData({
      playStart: false,
      endPlay: true,
      playing: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.detail) {
      var oldDetail = options.detail;
      var index = options.index;
      var detail = JSON.parse(oldDetail);
      var currentWordNumber = parseInt(detail.lesson.length+2);
      this.setData({
        homeworkname: detail.lesson + '作业',
        stuId: detail.student_list[index].student_id,
        tid: detail.teacher_id,
        sid: detail.student_list[index].shedule_info.id,
        work: detail,
        currentWordNumber: currentWordNumber
      })
    } else {
      var stuId = options.sid;
      this.setData({
        stuId: stuId,
        homeworkname: ''
      })
    }

    var that = this;
    this.recorderManager = wx.getRecorderManager();

    this.recorderManager.onError(function() {
      that.tip("录音失败！")
    });

    this.recorderManager.onStart(function(res) {
      var init = 0;
      that.data.secs = setInterval(function() {
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
        console.log(progress);
        that.setData({
          sec: inits,
          progress: progress,
          width: 394 * progress
        })
      }, 1000)
    })


    this.recorderManager.onStop(function(res) {
      that.setData({
        src: res.tempFilePath
      })
      console.log(res.tempFilePath)
      that.tip("录音完成！");
      clearInterval(that.data.secs);
      that.setData({
        playStart: false,
        endPlay: true,
        playing: false,
        is_record:true
      })


      that.uploadAudio(res.tempFilePath);


    });
    this.recorderManager.onInterruptionBegin(function(res) {
      that.recorderManager.pause();
      
      clearInterval(that.data.secs);
    })
    this.recorderManager.onError(function(res) {
      that.tip('录音失败');
      clearInterval(that.data.secs);
    })


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
      
      var currentTime = that.innerAudioContext.currentTime.toFixed(0);
      // if (currentTime > that.data.max) {
      //   currentTime = that.data.max;
      // }
      var pass_time = that.secondTransferTime(currentTime);
      console.log(pass_time);

      // that.setData({
      //   value: currentTime,
      //   pass_time: pass_time,
      //   percent: that.innerAudioContext.buffered / that.innerAudioContext.duration * 100,
      //   disabled: false
      // })
    })

    this.innerAudioContext.onEnded((res) => {
      that.setData({
        playStart: false,
        endPlay: true,
        playing: false,
        P_playStart: false,
        P_endPlay: true,
        P_playing: false,
        
      })
    })
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.innerAudioContext.stop()
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