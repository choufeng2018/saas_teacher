// pages/teacherSkip/teacherSkip.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        maxtext: 1000,
        currenttextNumber: 0,
        requireTexts: '',
        playStart: false,
        endPlay: false,
        playing: false,
        src: '',
        sec: '00:00',
        isload:false,
        upAudio:false
    },
    requireText(e) {
        var text = e.detail.value;
        var filterText = text.replace(/\s*/g, "");
        var len = parseInt(filterText.length);  
        if (len > this.data.maxtext) return;
        this.setData({
            currenttextNumber: len, //当前字数  
          requireTexts: filterText
        });
    },
    playRec: function () {
        var that = this;
        var init = 0;
        this.recorderManager.start({
          format: 'mp3',
          duration: 120000
        });
        that.data.secs = setInterval(function () {
            init++;
            var progress = (init / 120);
            if (init >= 60) {
                var secn = init % 60;
                var mi = Math.floor(init / 60);
                // if ((init/60)==1){
                //   var inits = '01:00'
                // }
                // if (mi>=1){
                //   var inits = mi + ':' + secn
                // }

                // var m = Math.floor((mi / 60 % 60)) < 10 ? '0' + Math.floor((mi / 60 % 60)) : Math.floor((mi / 60 % 60));
                var inits = mi + ':' + secn;

            } else if (init < 60) {
                var s = Math.floor((init % 60)) < 10 ? '0' + Math.floor((init % 60)) : Math.floor((init % 60));
                var inits = '00' + ':' + s;
            }


            console.log(progress);
            that.setData({
                sec: inits,
                progress: progress,
                width: 344 * progress
            })
        }, 1000)

        this.setData({
            playStart: true,
            playing: false,
            endPlay: false,
            //voice:voice
        })




    },
    endPlay: function () {
        var that = this;
        this.recorderManager.stop();
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
    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },
    playVoice: function () {
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
    endPlays() {
        this.innerAudioContext.pause();
        this.setData({
            playStart: false,
            endPlay: true,
            playing: false
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
            success: function (res) {
                if (res.confirm) {
                  clearInterval(that.data.secs);
                    that.setData({
                        src: '',
                        sec: '00:00',
                        playStart: false,
                        endPlay: false,
                        playing: false,
                        width:0
                    })
                }
            }
        })
    },
    uploadAudio(audio) {
        var token = wx.getStorageSync('token')
        var that = this;
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
    send() {
        var id = this.data.comment_id;
        var text = this.data.requireTexts;
        var audio = this.data.src;
        var isRecording = this.data.playStart;
        if (isRecording == true) {
            wx.showToast({
                title: '正在录音中,请先关闭当前录音',
                icon: 'none'
            })

            return false
        }

      var upAudio = this.data.upAudio;

      if (upAudio == false) {
        wx.showToast({
          title: '音频正在上传中，请稍后再操作',
          icon: 'none'
        })
        return false;
      }

      if (text == '' && audio=='') {
            wx.showToast({
                title: '批阅内容与语音至少填一项',
                icon: 'none'
            })
            return
        } else {
            this.setData({
              isload:true
            })
            clearInterval(this.data.secs);
            this.sendskip(id, text, audio);
        }
    },
    async sendskip(id, text, audio) {
        var token = wx.getStorageSync('token');
        var that=this;
        const data = await utils.post('practice/comment', {
            comment_id: id,
            audio: audio,
            content: text
        }, token);

        if (data.code == 1) {

            wx.showToast({
                title: data.msg,
                icon: 'none',
                success:function(){
                    wx.navigateBack({
                        delta: 1
                    })
                    that.setData({
                      isload: false
                    })

                  
                }
            })

            wx.setStorageSync('is_piyue', true)


            
        } else {
            wx.showToast({
                title: data.msg,
                icon: none
            })

          setTimeout(function () {
            that.setData({
              isload: false
            })
          }, 3000)
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //var currentWordNumber = parseInt(detail.lesson.length) + 2;
        this.setData({
            comment_id: options.id
        })


        // this.setData({
        //   homeworkname: detail.lesson + '作业',
        //   stuId: detail.student_list[index].student_id,
        //   tid: detail.teacher_id,
        //   sid: detail.student_list[index].shedule_info.id,
        //   work: detail,
        //   currentWordNumber: currentWordNumber
        // })

        var that = this;
        this.recorderManager = wx.getRecorderManager();
        this.recorderManager.onError(function () {
            that.tip("录音失败！")
        });

        this.recorderManager.onStop(function (res) {
            that.setData({
                src: res.tempFilePath
            })
            console.log(res.tempFilePath)
            that.tip("录音完成！");
            clearInterval(that.data.secs);
            that.setData({
              playStart: false,
              endPlay: true,
              playing: false
            })
            
                that.uploadAudio(res.tempFilePath);
        

        });

        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip("播放录音失败！")
        })

        this.innerAudioContext.onEnded((res) => {
            that.setData({
                playStart: false,
                endPlay: true,
                playing: false
            })
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
      this.innerAudioContext.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      this.innerAudioContext.stop();
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