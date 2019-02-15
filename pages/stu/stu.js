// pages/stu/stu.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vlist: [],
    noResult: false,
    w_cur: 0,
    stuType_cur: '',
    lesson_cur: '',
    mobile_cur: 0
  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var thd = e.currentTarget.dataset.thd;
    wx.navigateTo({
      url: '../stuDetail/stuDetail?' + 'id=' + id + '&thd=' + thd,
    })
  },
  addStu: function() {
    wx.navigateTo({
      url: '../createStu/createStu',
    })
  },
  getlesson: function() {
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: baseUrl + 'lesson/get_list',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        page_size: 100,
      },
      success: function(res) {
        var list = res.data.data;
        if (res.data.code == 1) {
          that.setData({
            lessonList: list
          })
        }
      }
    })
  },
  getStuList: function(page, name) {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: baseUrl + 'student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: name
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          page++;
          var vlist = that.data.vlist;

          for (var i = 0; i < res.data.data.data.length; i++) {
            vlist.push(res.data.data.data[i]);
          }

          that.setData({
            list: res.data.data.data,
            total: res.data.data,
            otherExt: res.data.ext,
            vlist: vlist
          })

          if (vlist.length != 0) {
            that.setData({
              noResult: false
            })
          }


          wx.hideLoading();
        }
      }
    })
  },
  inpuName: function(e) {
    var name = e.detail.value;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showNavigationBarLoading();
    page = 1;

    wx.request({
      url: baseUrl + 'student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: name
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          var vlist = res.data.data.data;
          that.setData({
            vlist: res.data.data.data
          })
          if (name != '' && vlist.length == 0) {
            that.setData({
              noResult: true
            })
          } else {
            that.setData({
              noResult: false
            })
          }
          that.setData({
            name: name
          })
          wx.hideLoading();
        }
      }
    })


    this.setData({
      name: name
    })
  },
  searchName: function(e) {
    console.log(e.detail.value);
    var name = e.detail.value;

    var token = wx.getStorageSync('token');
    var that = this;
    page = 1;
    wx.showNavigationBarLoading()
    wx.request({
      url: baseUrl + 'student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: name
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          var vlist = res.data.data.data;
          that.setData({
            vlist: res.data.data.data
          })
          if (name != '' && vlist.length == 0) {
            that.setData({
              noResult: true
            })
          } else {
            that.setData({
              noResult: false
            })
          }
          wx.hideLoading();
        }
      }
    })
    this.setData({
      name: name
    })
  },
  submits: function() {
    var is_bind_wechat = this.data.w_cur;
    var is_bind_mobile = this.data.mobile_cur;
    var learn_status = this.data.stuType_cur;
    var lesson_time_count = this.data.keshiNum;
    var lesson_id = this.data.lesson_cur;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        is_bind_wechat: is_bind_wechat,
        is_bind_mobile: is_bind_mobile,
        learn_status: learn_status,
        lesson_id: lesson_id,
        lesson_time_count: lesson_time_count

      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          var vlist = res.data.data.data;
          that.setData({
            vlist: res.data.data.data,
            showModalStatus: false
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          wx.hideLoading();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            success: function() {

            }
          })
        }
      }
    })

  },
  back: function() {
    this.getStuList(1, '');
  },
  setModalStatus: function(e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateX(300).step()
    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true
      });
    }
    setTimeout(function() {
      animation.translateX(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },
  wechat: function(e) {
    var w_index = e.currentTarget.dataset.w_index;
    var w_curs = this.data.w_cur;
    if (w_index != w_curs) {
      this.setData({
        w_cur: w_index
      })
    } else {
      this.setData({
        w_cur: 0
      })
    }

  },
  isMobile: function(e) {
    var m_index = e.currentTarget.dataset.m_index;
    var m_curs = this.data.mobile_cur;
    if (m_index != m_curs) {
      this.setData({
        mobile_cur: m_index
      })
    } else {
      this.setData({
        mobile_cur: 0
      })
    }


  },
  stuType: function(e) {
    var stuType = e.currentTarget.dataset.learn_status;
    var stuCur = this.data.stuType_cur;
    if (stuType != stuCur) {
      this.setData({
        stuType_cur: stuType
      })
    } else {
      this.setData({
        stuType_cur: null
      })
    }

  },
  keshiNum: function(e) {
    var keshi = e.detail.value;
    this.setData({
      keshiNum: keshi
    })
  },
  reset: function() {
    this.setData({
      w_cur: null,
      mobile_cur: null,
      stuType_cur: null,
      keshiNum: '',
      lesson_cur: ''
    })
  },
  slectCourses: function(e) {
    var lesson_id = e.currentTarget.dataset.id;
    var lesson_curs = this.data.lesson_cur;
    if (lesson_curs != lesson_id) {
      this.setData({
        lesson_cur: lesson_id
      })
    } else {
      this.setData({
        lesson_cur: ''
      })
    }
  },
  refreshToken: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'token/refresh',
      method: 'POST',
      header: {
        token: token
      },
      data: {

      },
      success: function(res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          wx.setStorageSync('token', res.data.data.token)
        } else if (res.data.code == 401) {
          wx.removeStorageSync('token');
          wx.showToast({
            title: 'token已失效，重新登录',
            duration: 1000,
            success: function() {
              wx.reLaunch({
                url: '../login/login',
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('load', true);
    this.getlesson();
    // var myrule=wx.getStorageSync('myrule');
    // //console.log(myrule);
    // for (var i = 0; i < myrule.length;i++){
    //   if (myrule[i]==103){
    //     var hasrule=true;
    //   }
    // }
    // if (hasrule){
    //   this.setData({
    //     hasrule: hasrule
    //   })  
    // }
    wx.showNavigationBarLoading()
    //this.getStuList(1, '');

    var token = wx.getStorageSync('token');
    var is_new = wx.getStorageSync('is_new')

    if (token) {
      this.refreshToken();
    }

    if (token == undefined || token == null || token == '') {
      wx.reLaunch({
        url: '../login/login',
      })
    }

    // if (token && is_new == 1) {
    //   wx.reLaunch({
    //     url: '../loginNew/loginNew',
    //   })
    // }
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
    page = 1;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showNavigationBarLoading();
    var load = wx.getStorageSync('load');
    wx.request({
      url: baseUrl + 'student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: 1,
        username: ''
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();

          that.setData({
            //list: res.data.data.data,
            vlist: res.data.data.data,
            otherExt: res.data.ext
          })
          wx.hideLoading();
        }
      }
    })
    wx.removeStorageSync('rankName');
    wx.removeStorageSync('rankId');
    this.setData({
      name: ''
    })
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
    var vlist = this.data.vlist;
    var list = this.data.list;
    var name = this.data.name;
    if (vlist.length % 20 == 0 && list != 0) {
      page++;
      this.getStuList(page, name);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})