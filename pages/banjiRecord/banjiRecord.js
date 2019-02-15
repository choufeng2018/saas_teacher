// pages/banjiRecord/banjiRecord.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        P_playing: false,
        P_endPlay: false,
        initIcon: '../../images/recordPlay.png',
        playIcon: '../../images/playings.gif',
        imgHoverIndex: 1000,

        value: 0,
        percent: 0,
        max: 17,
        pass_time: '00:00',
        total_time: '00:00'
    },
    async commentdetail(pratice_id, kpl_id) {
        var token = wx.getStorageSync('token');
        const data = await utils.get('practice/comment_class_record', {
            pratice_id: pratice_id,
            kpl_class_id: kpl_id
        }, token);
        if (data.code == 1) {
            this.setData({
                recordList: data.data.record
            })
            wx.hideLoading();
        }
    },
    selectAudio(e) {
        var audio = e.currentTarget.dataset.audio;
        var index = e.currentTarget.dataset.index;
        var time = e.currentTarget.dataset.time;
        var seconds = e.currentTarget.dataset.seconds;
        this.setData({
            audio: audio,
            imgHoverIndex: index,
            max: seconds,
            total_time: time
            //initIcon:'../../images/playings.png'
        })


        console.log(audio)
        this.playAudio.autoplay = true;
        this.playAudio.src = audio;
        this.playAudio.play();
        this.playAudio.onPlay(() => {
            console.log('开始播放')
        })
        this.setData({
            P_playing: true,
            P_endPlay: false,
        })

    },
    P_endPlay: function() {
        var that = this;

        this.playAudio.pause();

        //clearInterval(that.data.secs);
        this.setData({
            P_playStart: false,
            P_endPlay: true,
            P_playing: false
        })
    },
    P_contiunePlay: function() {
        this.playAudio.play();
        this.setData({
            P_playStart: false,
            P_endPlay: false,
            P_playing: true
        })
    },
    tip: function(msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },
    P_playRec:function(){
        var audio=this.data.audio;
        if(audio==''){
            wx.showToast({
                title: '当前未选择播放录音',
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.wxzxSlider = this.selectComponent("#wxzxSlider");
        wx.showLoading({
            title: '正在加载中',
        })

        var that = this;
        var kpl_id = options.kpl_class_id;
        var pratice_id = options.pratice_id;
        this.setData({
            kpl_id: kpl_id,
            pratice_id: pratice_id
        })

        this.commentdetail(pratice_id, kpl_id);

        this.playAudio = wx.createInnerAudioContext();
        this.playAudio.onError((res) => {
            that.tip("播放录音失败！");
            that.setData({
                imgHoverIndex: 1000,
                P_endPlay: false,
                P_playing: false
            })
        })

        this.playAudio.onTimeUpdate(function() {
            if (!that.wxzxSlider.properties.isMonitoring) {
                return
            }
            var currentTime = that.playAudio.currentTime.toFixed(0);
            if (currentTime > that.data.max) {
                currentTime = that.data.max;
            }
            var pass_time = that.secondTransferTime(currentTime);
            that.setData({
                value: currentTime,
                pass_time: pass_time,
                percent: that.playAudio.buffered / that.playAudio.duration * 100,
                disabled: false
            })
        })

        this.playAudio.onEnded((res) => {
            console.log('jieshu');
            that.setData({
                P_endPlay: false,
                P_playing: false,

                value: 0,
                pass_time: '00:00',
                percent: 0,

            })
        })
    },
    // 点击slider时调用
    sliderTap: function(e) {
        console.log("sliderTap")
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
        this.playAudio.seek(Number(seek_time));
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

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
      this.playAudio.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
      this.playAudio.stop();
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