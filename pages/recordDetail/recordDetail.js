// pages/recordDetail/recordDetail.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime');
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAlert: false,
    list: [{
        id: '0',
        title: '课程订单'
      },
      {
        id: '1',
        title: '操作记录'
      }
    ],
    selectedId: '0',
    scroll: true,
    fixed: true,
    height: 44,
    backhour: '',
    lesson_count: '',
    money: '',
    remark: ''
  },
  backMoney: function(e) {
    var money = e.detail.value;
    this.setData({
      money: money
    })
  },
  backHour: function(e) {
    var hour = e.detail.value;
    this.setData({
      lesson_count: hour
    })

  },
  remark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  reback: function() {
    this.setData({
      showAlert: true
    })
  },
  cancel: function() {
    this.setData({
      showAlert: false
    })
  },
  async tuifee(out_trade_no, order_id, lesson_count, money, remark) {
    var token = wx.getStorageSync('token')
    const data=await utils.post('/api/backend.lesson_order/refund_order', {
      out_trade_no: out_trade_no,
      order_id: order_id,
      lesson_count: lesson_count,
      money: money,
      remark: remark
    }, token);
    if(data.code==1){
      wx.showToast({
        title: data.msg,
        icon: 'none'
      })
      this.get_detail();
      this.setData({
        showAlert:false
      })
    }else{
      wx.showToast({
        title: data.msg,
        icon:'none'
      })
    }
  },
  sure: function() {
    var out_trade_no = this.data.order.out_trade_no;
    var maxMoney = parseInt(this.data.order.money);
    var maxCount = parseInt(this.data.order.lesson_count);
    var money = this.data.money;
    var lesson_count = this.data.lesson_count;
    if (money !== '') {
      var money = parseInt(money)
    } else if (lesson_count != '') {
      var lesson_count = parseInt(lesson_count)
    }



    var order_id = this.data.order_id;
    var remark = this.data.remark;
    console.log(lesson_count)





    if (lesson_count == '' || lesson_count == null) {
      wx.showToast({
        title: '请输入退课课时',
        icon: 'none'
      })
      return false;
    } else if (money == '' || money == null) {
      wx.showToast({
        title: '请输入退费金额',
        icon: 'none'
      })
      return false;
    } else if (money > maxMoney) {
      wx.showToast({
        title: '退费金额不能大于' + maxMoney,
        icon: 'none'
      })
      return false;
    } else if (lesson_count > maxCount) {
      wx.showToast({
        title: '扣课时数不能大于' + maxCount,
        icon: 'none'
      })
      return false;
    } else {
    
      this.tuifee(out_trade_no, order_id, lesson_count, money, remark);
    }

  },

  change: function(e) {
    console.log(e.detail.current + 'ee');
    var cur = e.detail.current;
    this.setData({
      selectedId: cur
    })
  },
  handleTabChange: function(e) {
    var cur = e.detail;
    this.setData({
      selectedId: cur
    })
  },
  //作废订单
  bolish: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    var order_id = that.data.order_id;
    var order_num = this.data.order.out_trade_no;
    wx.showModal({
      title: '提示',
      content: '您是否要作废该订单？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: baseUrl + '/api/backend.lesson_order/refuse_order',
            method: 'POST',
            header: {
              token: token
            },
            data: {
              order_id: order_id,
              out_trade_no: order_num
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '作废成功',
                  success:function(){
                    wx.navigateBack({
                      delta:1
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  image: '../../images/warn.png'
                })
              }
            }
          })
        }
      }
    })
   

  },
  toEdit: function(e) {
    var order_id = e.currentTarget.dataset.id;
    var order_title = e.currentTarget.dataset.title;
    var price = e.currentTarget.dataset.price;
    var pid = e.currentTarget.dataset.pid;
    var num = e.currentTarget.dataset.num;
    var lesson_count = e.currentTarget.dataset.lesson_count;
    var money = e.currentTarget.dataset.money;
    var student_info = e.currentTarget.dataset.stuinfo;
    console.log(e.currentTarget.dataset.stuinfo)
    var newStuInfo = JSON.stringify(student_info);

    var discount = e.currentTarget.dataset.discount;
    var free_money = e.currentTarget.dataset.free_money;
    var fee = e.currentTarget.dataset.fee;
    var total = e.currentTarget.dataset.total;
    var already_lesson = e.currentTarget.dataset.already_lesson;
    var remark = e.currentTarget.dataset.remark;
    var type = e.currentTarget.dataset.type;
    var status=e.currentTarget.dataset.status;
    var utime = e.currentTarget.dataset.utime;

    wx.navigateTo({
      url: '../editCourseOrder/editCourseOrder?' + 'num=' + num + '&pid=' + pid + '&order_id=' + order_id + '&order_title=' + order_title + '&price=' + price + '&lesson_count=' + lesson_count + '&money=' + money + '&stuInfo=' + newStuInfo + '&discount=' + discount + '&free_money=' + free_money + '&fee=' + fee + '&total=' + total + '&already_lesson=' + already_lesson + '&remark=' + remark + '&type=' + type + '&status=' + status +'&utime='+utime,
    })
  },
  /// /api/backend.order_log/get_list
  getActList: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    var order_id = that.data.order_id;
    wx.request({
      url: baseUrl + '/api/backend.order_log/get_list',
      method: 'POST',
      header: {
        token: token
      },
      data: {
        order_id: order_id,
        page: page,
        page_size: 10
      },
      success: function(res) {
        if (res.data.code == 1) {

          that.setData({
            actList: res.data.data.data
          })

          wx.hideLoading();
        }
      }
    })
  },

  get_detail: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    var order_id = that.data.order_id;
    wx.request({
      url: baseUrl + '/api/backend.product_order/get_detail',
      method: 'get',
      header: {
        token: token
      },
      data: {
        order_id: order_id,
      },
      success: function(res) {
        if (res.data.code == 1) {
          var num = res.data.data.buy_class_time;
          var pr = res.data.data.price;
          var disc = res.data.data.discount;
          var fr = res.data.data.free_money;
          var courseSum=num*pr;
          
          var hasF = parseFloat(courseSum) - parseFloat(courseSum * disc) + parseFloat(fr);

          that.setData({
            order: res.data.data,
            hasF: hasF
          })

          wx.hideLoading();
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var order_id = options.id;
    that.setData({
      order_id: options.id
    })
    wx.removeStorageSync('choosedPro')
    this.get_detail();
    this.getActList();
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
    this.get_detail();
    this.getActList();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})