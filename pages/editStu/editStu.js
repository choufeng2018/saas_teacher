// pages/editStu/editStu.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    genders: [{
        gender_id: 1,
        gender_txt: '男'
      },
      {
        gender_id: 2,
        gender_txt: '女'
      }
    ],
    stuSort: [{
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
      }
    ],
    index: '',
    birthday: '',
    TpChange: '',
    rankName: '',
    id: '',
    mobile: '',
    level_id: '',
    avatar: '',
    birthday: '',
    gender: '',
    remark: '',
    sno: '',
    status: '',
    learn_status: '',
    levelname: '',
    username: '',
    duration: 1000,
    content: '姓名、性别、联系方式为必填',
    $zanui: {
      toptips: {
        show: false
      }
    },
    maxtext: 140,
    currenttextNumber: 0,
  },
  genderChange: function(e) {
    var gen = e.detail.value;
    var gender = Number(gen) + 1;
    this.setData({
      index: e.detail.value,
      gender: gender
    })
  },
  dateChange: function(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  typeChange: function(e) {
    var dates = e.detail.value;
    var newDates = parseInt(dates) + 1;
    this.setData({
      TpChange: e.detail.value,
      learn_status: newDates
    })
  },
  toSelect: function() {
    wx.navigateTo({
      url: '../stuRank/stuRank',
    })
  },
  upload: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
          success: function(res) {

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

  user: function(e) {
    var username = e.detail.value;
    this.setData({
      username: username
    })
  },
  mobile: function(e) {
    var mobile = e.detail.value;
    this.setData({
      mobile: mobile
    })
  },
  addressed: function(e) {
    var address = e.detail.value;
    this.setData({
      address: address
    })
  },
  remark: function(e) {
    var text = e.detail.value;
    var filterText = text.replace(/\s*/g, "")
    var len = parseInt(filterText.length);
    if (len > this.data.maxtext) return;
    this.setData({
      currenttextNumber: len, //当前字数  
      remark: filterText
    });
  },
  subData: function(stuid, username, avatar, mobile, gender, birthday, remark, address) {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'student/edit_student',
      method: 'POST',
      header: {
        token: token
      },
      data: {
        id: stuid,
        username: username,
        avatar: avatar,
        mobile: mobile,
        gender: gender,
        birthday: birthday,
        address: address,
        remark: remark
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '修改成功',
            duration:2000,
            success:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  editStu: function(e) {
    var that = this;
    var stuid = this.data.id;
    var username = this.data.username;
    var avatar = this.data.avatar;
    var mobile = this.data.mobile;
    var gender = this.data.gender;
    var birthday = this.data.birthday;
    // var learn_status = this.data.learn_status;
    // var status = this.data.status;
    var address = this.data.address;
    var remark = this.data.remark;
    if (mobile != '') {
      var re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!re.test(mobile)) {
        wx.showToast({
          title: '手机号格式有误',
          icon: 'none'
        })
        return false;
      }
    }

    console.log(stuid, username, gender, mobile)

    if (stuid === '' || username === '' || gender === '' || mobile === '') {
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
      that.subData(stuid, username, avatar, mobile, gender, birthday, remark, address)
    }




  },
  get_detail: function(thd) {
    var token = wx.getStorageSync('token');
    var that = this;
    //var thd = that.data.thd;
    wx.request({
      url: baseUrl + 'student/get_detail',
      method: 'get',
      header: {
        token: token
      },
      data: {
        student_id: thd
      },

      success: function(res) {
        if (res.data.code == 1) {
          var detail = res.data.data;
          var currenttextNumber = parseInt(detail.remark.length)
          that.setData({
            //detail: res.data.data,
            id: detail.third_id,
            username: detail.username,
            avatar: detail.avatar,
            mobile: detail.mobile,
            gender: detail.gender,
            birthday: detail.birthday,
            address: detail.address,
            remark: detail.remark,
            currenttextNumber: currenttextNumber
          })
          //wx.hideLoading();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // var old = options.detail;
    // var detail = JSON.parse(old);
    
    var thd = options.thd;

    this.setData({
      thd: thd,

      
    })

    this.get_detail(thd);
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
    // var rankName=wx.getStorageSync('rankName');
    // if (rankName != undefined && rankName!=''){
    //   this.setData({
    //     levelname: rankName
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('rankName');
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