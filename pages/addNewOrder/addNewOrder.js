// pages/addNewOrder/addNewOrder.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // youhui:0,
    summaryPrice: 0,
    index: '',
    statuindex: '',
    hasfree: 0,
    already_lesson: '',
    free_money: 0,
    discount: 1,
    fee: 0,
    remark: '',
    mark:true,
    contract_type: [{
        id: 1,
        txt: '课程购买'
      },
      {
        id: 3,
        txt: '课程赠送'
      }
    ],
    statu: [{
        id: 1,
        txt: '正常'
      },
      {
        id: 2,
        txt: '退费'
      }
    ],
    hour: '',
    place: ''
  },
  tabmark:function(){
    this.setData({
      mark:false
    })
  },
  summary:function(e){
    //console.log(e)
    this.setData({
      total:e.detail.value,
      realtotal: e.detail.value,
      free_money:0,
      fee:0,
      discount:1
    })
  },
  getNowFormatDate: function() {
    var token = wx.getStorageSync('token');
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;


    this.setData({
      date: currentdate
    })
    return currentdate;
  },
  dateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  select: function() {
    wx.navigateTo({
      url: '../stuList/stuList',
    })
  },

  contractChange: function(e) {
    var index = e.detail.value;
    var list = this.data.contract_type;
    var contarctId = list[index].id;
    var initTotal = this.data.total;
    var discount = this.data.discount;
    var free_money = this.data.free_money;
    var fee = this.data.fee;
    var already_lesson = this.data.already_lesson;
    this.setData({
      index: e.detail.value,
      contarctId: contarctId
    })

    if (contarctId == 3) {
      this.setData({
        realtotal: 0,
        discount: 0,
        free_money: '',
        fee: '',
        already_lesson: ''
      })
    } else if (contarctId == 1) {
      this.setData({
        realtotal: initTotal,
        discount: discount,
        free_money: free_money,
        fee: fee,
        already_lesson: already_lesson
      })
    }
  },

  orderChange: function(e) {
    this.setData({
      statuindex: e.detail.value,
      statu: e.detail.value
    })
  },
  hasCourse: function(e) {
    var already_lesson = e.detail.value;
    this.setData({
      already_lesson: already_lesson
    })
  },
  add: function() {
    var product_id = this.data.detail.id;
    var num = this.data.hour;
    var real_salary = this.data.realtotal;
    var fee = this.data.fee;
    var contract_type = this.data.contarctId;
    var free_money = this.data.free_money;
    var discount = this.data.discount;
    var price = this.data.inpuPrice;
    //var discount = unshift/100;
    var signtime = this.data.date;

    var already_lesson = this.data.already_lesson;
    var remark = this.data.remark;
    var total=this.data.total;
    var muti = this.data.muti_choose;
    if (muti) {

      var stu = [];
      for (var i = 0; i < muti.length; i++) {
        stu.push(muti[i].id)
      }
      var student_id = stu.join(',')
      console.log(student_id);
    } else {
      var student_id = '';
    }

    console.log(num)

    if (num == '' || num == undefined) {
      wx.showToast({
        title: '请填写课时数',
        icon: 'none'
      })
    }else if (student_id == '') {
      wx.showToast({
        title: '请选择学员',
        icon: 'none'
      })
    } else {
      this.send(price, product_id, num, real_salary, contract_type, discount, free_money, fee, student_id, already_lesson, remark, signtime,total)
    }

  },
  async send(price, product_id, num, real_salary, contract_type, discount, free_money, fee, student_id, already_lesson, remark, signtime,total) {
    var token = wx.getStorageSync('token')
    const data = await utils.post('/api/backend.lesson_order/create_order', {
      signtime: signtime,
      price: price,
      product_id: product_id,
      buy_class_time: num,
      real_salary: real_salary,
      contract_type: contract_type,
      discount: discount,
      free_money: free_money,
      fee: fee,
      student_id: student_id,
      already_lesson: already_lesson,
      remark: remark,
      total: total
    }, token);
    if (data.code == 1) {
      wx.showToast({
        title: data.msg,
        duration:1000,
        success:function(){
          wx.navigateBack({
            delta: 2
          })
        }
      })
    } else {
      wx.showToast({
        title: data.msg,
        icon: 'none'
      })
    }
  },
  remark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  keshiNum: function(e) {
    var hour = e.detail.value;
    this.setData({
      hour: hour
    })
  },
  inpuPrice: function(e) {
    var num = this.data.hour;
    var price = e.detail.value;
    var summary = num * price;
    var discount = this.data.discount;
    var total = this.data.total;
    var o = this.data.free_money;
    var fee = this.data.fee;
    if (num == '' || num == undefined) {
      wx.showToast({
        title: '请先填写课时数',
        icon: 'none'
      })
      return '';
    }

    console.log('hahah哈哈')



    this.setData({
      place: '',
      inpuPrice: price,
      realtotal: summary,
      hasfree: 0,
      free_money: 0,
      discount: 1,
      // youhui:100,
      total: summary,
      summaryPrice: summary,
      fee: 0
    })

  },
  otherFee: function(e) {
    var that = this;
    var fee = e.detail.value;
    var price = this.data.price;
    var num = this.data.hour;
    var discount = this.data.discount;
    var o = this.data.free_money;
    var total = this.data.total;
    var d = parseFloat(total) * discount;
    // if (price == '') {
    //   wx.showToast({
    //     title: '请先填写课时数和单价',
    //     icon: 'none'
    //   })
    // }

    if (discount == 100 || discount == '') {
      var discount = 1;
      var d = 0;
    }

    if (discount == 0) {
      that.setData({
        discount: 1
      })

    }

    if (fee != 0 || fee != '') {
      var has_free = parseFloat(total) - d + parseFloat(o);
    }



    //var rea = total - has_free + fee;

    var rea = parseFloat(total) - (parseFloat(total) - d) + parseFloat(fee) - o;

    if (o == '') {
      var o = 0;
    }

    if (fee != '' && discount != 1) {
      //var fee = e.detail.value;
      this.setData({
        realtotal: rea,
        hasfree: has_free,
        free_money: o,
        fee: fee
      })
    }

    if (fee == '') {
      var fee = 0;
    }

    //console.log(fee)
    if (fee != '' && discount == 1) {
      //var fee = e.detail.value;
      //console.log(fee);
      var rea = parseFloat(total) + parseFloat(fee) - parseFloat(o);
      //console.log(rea)
      this.setData({
        fee: fee,
        discount: 1,
        realtotal: rea,
        hasfree: o,
        free_money: o,
      })
    }
    if (fee == '' || fee == 0) {
      var fee = 0;
      //console.log(parseFloat(total) - d + parseFloat(o) - fee);
      this.setData({
        has_free: parseFloat(total) - d + parseFloat(o)
      })
      var has_free = parseFloat(total) - d + parseFloat(o);
      if (discount == 1) {
        var real = total - o;

      } else {
        var real = total - (total - d) - o;
      }

      //console.log('kongle')

      this.setData({
        fee: 0,
        realtotal: real,
        has_free: parseFloat(total) - d + parseFloat(o)
      })
    }
  },
  discount: function(e) {
    var that = this;
    var val = e.detail.value;
    var fee = this.data.fee;
    var o = this.data.free_money;
    var total = this.data.total;
    var real_salary = this.data.realtotal;
    var price = this.data.inpuPrice;
    var num = this.data.hour;

    if (num == '' || num == undefined) {
      wx.showToast({
        title: '请先填写课程课时',
        icon: 'none'
      })

      this.setData({
        youhui: 100
      })
      return '';
    }
    console.log(o)
    if (fee == '' || fee == null) {
      var fee = 0;
    }
    if (o == '') {
      var o = 0;
    }
    if (val > 100) {
      wx.showToast({
        title: '折扣不能大于100%',
        icon: 'none',
        success: function() {

          that.setData({
            discount: 1,
            youhui: 100,
            realtotal: parseFloat(total),
            free_money: 0,
            hasfree: 0,
            place:0
          })
        }
      })
    }
    if (val) {
      var discount = parseInt(val) / 100;
    } else {
      var discount = 1;
    }


    if (discount != '' && discount != 0 && discount != 1) {
      var d = total * discount;
      var re_money = total - parseFloat(d);
      var has_free = total - parseFloat(d) + parseFloat(o);
      //var rea = parseInt(total) - has_free + parseFloat(fee);
      var rea =parseFloat(d) - parseFloat(o) + parseFloat(fee)

      this.setData({
        discount: discount,
        realtotal: rea,
        hasfree: has_free
      })

    } else if (discount == 0 || discount == '' || discount == null) {
      wx.showToast({
        title: '折扣不能为0',
        icon: 'none',
        success: function() {
          that.setData({
            discount: 1,
            youhui: 100,
            realtotal: parseFloat(total) + parseFloat(fee) - parseFloat(o),
            hasfree: o
          })
        }
      })

    }

    if (discount == 1) {
      var rea = parseFloat(total) + parseFloat(fee);
      this.setData({
        discount: 1,
        realtotal: rea,
        hasfree: o
      })
    }

  },
  free_money: function(e) {
    var discount = this.data.discount;
    var fee = this.data.fee;
    var fee=Number(fee);

    var o = e.detail.value;
    var o =Number(o);
    var total = this.data.total;
    var total=Number(total);
    var real_salary = this.data.realtotal;
    var d = parseInt(total) * discount;
    if (discount == 100 || discount == '') {
      var discount = 1;
    }
    if (o == '' || o == 0) {
      var o = 0;
      this.setData({
        hasfree: parseFloat(total) - d,
        free_money: 0,
        realtotal: parseFloat(total) - (parseFloat(total) - d) + parseFloat(fee)
      })
    }
    if (fee = '') {
      var fee = 0;
    }

    var afterYouhui = parseFloat(total) - d;

    // if (discount == 1) {
    //   var rea = total + fee -o;
    // } else {
    //   var rea = afterYouhui + parseFloat(fee) - parseFloat(o);
    // }


    // console.log(rea);
    var has_free = parseInt(total) - d + parseFloat(o);

    console.log(o)
    if (o != '' && discount != 1) {
      var d = parseInt(total) * discount;
      var fee = this.data.fee;
      var sb = parseFloat(total) - (parseFloat(total) - d) + parseFloat(fee) - o;
      if (sb < 0) {
        wx.showToast({
          title: '优惠金额不能多余应收金额',
          icon: 'none'
        })

        this.setData({
          realtotal: 0,
          hasfree:0,
          free_money:0
        })
      } else {
        this.setData({
          realtotal: sb,
          hasfree: has_free,
          free_money: o
        })
      }


    }

    if (discount == 1) {
      var fee = this.data.fee;
      var d = 0;
      var sb = parseFloat(total) - (parseFloat(total) - d) + parseFloat(fee) - o;
      var rea = total + parseFloat(fee) - o;
      if (sb < 0) {
        wx.showToast({
          title: '优惠金额不能多余应收金额',
          icon: 'none'
        })
        this.setData({
          realtotal: 0,
          hasfree: 0,
          free_money: 0
        })

      }else{
        this.setData({
          discount: 1,
          realtotal: rea,
          hasfree: o,
          free_money: o
        })
      }

      
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var details = options.detail;
    console.log(details)
    this.getNowFormatDate();
    var detail = JSON.parse(details);
    var num = parseInt(detail.hour);
    var price = parseInt(detail.price);
    var total = num * price;
    var contarctId = detail.status;
    this.setData({
      contarctId: contarctId,
      detail: detail,
      total: total,
      realtotal: total,
      //hour:num
    })
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
    var that = this;
    
    var addStu = wx.getStorageSync('addStu');
    if (addStu != '') {
      var old = this.data.muti_choose;
      that.setData({
        muti_choose: addStu
      })
    }
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
    wx.removeStorageSync('addStu');
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