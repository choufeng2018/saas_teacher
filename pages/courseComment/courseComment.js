// pages/courseComment/courseComment.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics:[],
    picboxs:[],
    comentVal:''
  },
  close:function(e){
    var index=e.currentTarget.dataset.index;
    // var picboxs = this.data.picboxs;
    var picboxs = this.data.pics;
    var newpic=picboxs.splice(index,1);
    console.log(newpic)
    console.log(picboxs)
    this.setData({
      picboxs: picboxs
    })
  },
 
  upload:function(){
    var that=this;
    var oldPic = this.data.picBox;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // var file = that.data.tempFilePaths;
        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        //   file.push(res.tempFilePaths[i]);
        // }
        var l = oldPic.concat(tempFilePaths)
        
        that.setData({
          picBox: l
        })
      }
  })
  },
  uploads:function(){
    var that = this;
    var pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
       
       
        //that.ups();
   
      },
      fail: function () {
        // fail
      },
      complete: function () {
        
      }
    })
  },
  ups:function(){
    var pics = this.data.pics;
    this.uploadimg({
      url: baseUrl + 'common/upload',
      path: pics//这里是选取的图片的地址数组
    });
  },
  uploadimg:function (data) {
    wx.showLoading({
      title: '正在上传中'
    })
    var picboxs = [];
    var oldPic = this.data.picboxs;
    var that = this;
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
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
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
      
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          that.send();
        } else {//若图片还没有传完，则继续调用函数
     
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  commentTxt:function(e){
    var comentVal=e.detail.value;
    this.setData({
      comentVal: comentVal
    })
  },
  sends:function(){
    var pics=this.data.pics;
    var content = this.data.comentVal;
    if(content == ''){
      wx.showToast({
        title: '内容不能为空',
        image: '../../images/warn.png'
      })
    } else if (content!=''){
      if(pics.length==0){
        this.send();
      }else{
        this.ups();
      }
      
    }

   
  },
  send:function(){

    var that = this;
    var shedule_id = this.data.shedule_id;
    var student_id = this.data.student_id;
    var content = this.data.comentVal;
    var pics=this.data.picboxs;
    var newPic = pics.join(","); 
    
    //return false;
    //var videos = this.data.videos;
    if(content==''){
      wx.showToast({
        title: '内容不能为空',
        image:'../../images/warn.png'
      })
    }else{
      var token = wx.getStorageSync('token');
      // for (var i = 0; i < pics.length;i++){
      // }
      
      wx.request({
        url: baseUrl + 'shedule_comment/add',
        method: 'POST',
        header: {
          token: token
        },
        data: {
          shedule_id: shedule_id,
          student_id: student_id,
          content:content,
          attachment: newPic
        },
        success: function (res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: '评论成功',
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        }
      })

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shedule_id = options.shedule_id;
    var student_id = options.student_id;
    this.setData({
      shedule_id: shedule_id,
      student_id: student_id
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