// pages/editStu/editStu.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    genders: [
      {
        gender_id: 1,
        gender_txt: '男'
      },
      {
        gender_id: 2,
        gender_txt: '女'
      }
    ],
    stuSort: [
      {
        learn_status: 1,
        txt: '在读'
      },
      {
        learn_status: 2,
        txt: '试听'
      },
      {
        learn_status: 3,
        txt: '过期'
      },
      {
        learn_status: 4,
        txt: '停课'
      }
    ],
    index: '',
    birthday: '',
    TpChange: '',
    rankName: '',
    id: '',
    mobile: '',
    level_id: '',
    avatar: '../../images/avatar.png',
    birthday: '',
    gender: '',
    remark: '',
    sno: '',
    status: '',
    learn_status: '',
    levelname: '',
    username: '',
    duration: 1000,
    content: '姓名、性别、联系方式不能为空',
    $zanui: {
      toptips: {
        show: false
      }
    },
    isCreate:false,
    loading:false,
    
    maxtext: 140,
    currenttextNumber: 0,
  },
  // phoneTest:function(e){
  //   var phone=e.detail.value;
  //   var re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  //   if (!re.test(phone)) { 
  //     wx.showToast({
  //       title: '手机号格式有误',
  //       icon:'none'
  //     })
  //     return false;
  //   }
  // },
  genderChange: function (e) {
    var gen = e.detail.value;
    var gender = Number(gen)+1;
    this.setData({
      index: e.detail.value,
      gender: gender
    })
  },
  dateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  typeChange: function (e) {
    var dates = e.detail.value;
    var newDates = parseInt(dates) + 1;
    this.setData({
      TpChange: e.detail.value,
      learn_status: newDates
    })
  },
  toSelect: function () {
    wx.navigateTo({
      url: '../stuRank/stuRank',
    })
  },
  upload: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: baseUrl + 'common/upload',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            token: token
          },
          formData: {
            'file': tempFilePaths
          },
          success: function (res) {

            var Tojson = JSON.parse(res.data)
            if (Tojson.code == 1 || Tojson.code == 200) {
              console.log(Tojson.data.url)
              var avatar = Tojson.data.url;
              that.setData({
                avatar: avatar
              })
            }
          }
        })
        
      }
    })
  },
  user: function (e) {
    var username = e.detail.value;
    this.setData({
      username: username
    })
  },
  mobile: function (e) {
    var mobile = e.detail.value;
    this.setData({
      mobile: mobile
    })
  },
  address: function (e) {
    var address = e.detail.value;
    this.setData({
      address: address
    })
    
  },
  
  remark:function(e){
    //var remark = e.detail.value;
    var text = e.detail.value;
    var filterText = text.replace(/\s*/g, "")
    var len = parseInt(filterText.length);
    if (len > this.data.maxtext) return;
    this.setData({
      currenttextNumber: len, //当前字数  
      remark: filterText
    });
    // this.setData({
    //   remark: remark
    // })
  },
  subData: function (username, avatar, mobile, gender, birthday, remark, address) {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'student/add_member',
      method: 'POST',
      header: {
        token: token
      },
      data: {
        username: username,
        avatar: avatar,
        mobile: mobile,
        gender: gender,
        birthday: birthday,
        address:address,
        remark: remark
      },
      success: function (res) {
        if (res.data.code == 1) {

          setTimeout(function () {
            that.setData({
              isCreate: false,
              loading: false
            })
          }, 1500)
          wx.showToast({
            title: '添加成功',
            duration:1500,
            success:function(){
              wx.removeStorageSync('rankName');
              wx.removeStorageSync('rankId');
              wx.navigateBack({
                delta: 1
              })
            }
          })

          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })

          setTimeout(function(){
            that.setData({
              isCreate: false,
              loading: false
            })
          },1500)
        }
      }
    })
  },

  editStu: function (e) {
    var that = this;
    //var levelname = this.data.levelname;
    var stuid = this.data.id;
    var address = this.data.address;
    var username = this.data.username;
    var avatar = this.data.avatar;
    if (avatar =='../../images/avatar.png'){
      var avatar='';
    }
    var mobile = this.data.mobile;
    var gender = this.data.gender;
    var birthday = this.data.birthday;
    //var learn_status = this.data.learn_status;
    //var status = this.data.status;
    //var sno = this.data.sno;
    var remark = this.data.remark;
    if (mobile!=''){
      var re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!re.test(mobile)) {
        wx.showToast({
          title: '手机号格式有误',
          icon: 'none'
        })
        return false;
      }
    }
    


    
    if (username == '' || gender == '' || mobile=='') {
      that.setData({
        $zanui: {
          toptips: {
            show: true
          }
        }
      })
      setTimeout(() => {
        that.setData({
          $zanui: {
            toptips: {
              show: false
            }
          }
        })
      }, that.data.duration);
    } else {
      //验证通过后
      that.setData({
        isCreate:true,
        loading:true
      })
      that.subData(username, avatar, mobile, gender, birthday, remark, address)
    }




  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var levelname = options.levelname;
    // var stuid = options.id;
    // var level_id = options.level_id;
    // var username = options.username;
    // var avatar = options.avatar;
    // var mobile = options.mobile;
    // var gender = options.gender;
    // var birthday = options.birthday;
    // var learn_status = options.learn_status;
    // var status = options.status;
    // var sno = options.sno;
    // var remark = options.remark;
    this.setData({
      // id: stuid,
      // level_id: level_id,
      // username: username,
      // avatar: avatar,
      // mobile: mobile,
      // gender: gender,
      // birthday: birthday,
      // learn_status: learn_status,
      // status: status,
      // sno: sno,
      // remark: remark,
      // levelname: levelname
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
    var rankName = wx.getStorageSync('rankName');
    var rankId = wx.getStorageSync('rankId');
    if (rankName != undefined && rankName != '') {
      this.setData({
        levelname: rankName,
        level_id:rankId
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
    wx.removeStorageSync('rankName');
    wx.removeStorageSync('rankId');
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