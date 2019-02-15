// pages/editCourseOrder/editCourseOrder.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place:'',
    pid: '',
    num: '',
    tType: '',
    order_type: '',
    order_title: '',
    order_id: '',
    duration: 1000,
    content: '请填写完整表单',
    utime: '',
    orderType: [
      {
        id: 1,
        txt: '课程购买'
      },
      {
        id: 3,
        txt: '课程赠送'
      }
    ],
    $zanui: {
      toptips: {
        show: false
      }
    },
    summaryPrice: 0
  },
  summary: function (e) {
    //console.log(e)
    this.setData({
      total: e.detail.value,
      realtotal: e.detail.value,
      free_money: 0,
      fee: 0,
      discount: 1,
      place:'',
      hasfree:0
    })
  },
  addStu: function () {

  },
  toCourse: function () {
    wx.navigateTo({
      url: '../chooseClass/chooseClass',
    })
  },
  orderChange: function (e) {
    var type = e.detail.value;
    var list = this.data.orderType;
    var typeId = list[type].id;
    var that = this;
    var initTotal = this.data.total;
    var discount = this.data.discount;
    var free_money = this.data.free_money;
    var fee = this.data.fee;
    var already_lesson = this.data.already_lesson;
    that.setData({
      tType: type,
      order_type: typeId
    })

    if (typeId == 3) {
      this.setData({
        realtotal: 0,
        discount: 0,
        free_money: '',
        fee: '',
        already_lesson: ''
      })
    } else if (typeId == 1) {
      this.setData({
        realtotal: initTotal,
        discount: discount,
        free_money: free_money,
        fee: fee,
        already_lesson: already_lesson
      })
    }
  },
  choosePro: function () {
    wx.navigateTo({
      url: '../proList/proList',
    })
  },
  inpuPrice: function (e) {
    var num = this.data.num;
    var price = e.detail.value;
    var summary = num * price;
    var discount = this.data.discount;
    var total = this.data.total;
    var o = this.data.free_money;
    var fee = this.data.fee;



    this.setData({
      inpuPrice: price,
      realtotal: summary,
      hasfree: 0,
      free_money: 0,
      discount: 1,
      youhui: 100,
      total: summary,
      summaryPrice: summary,
      fee: 0,
      place:''
    })

  },
  discount: function (e) {
    var that = this;
    var val = e.detail.value;
    var fee = this.data.fee;
    var o = this.data.free_money;
    var total = this.data.total;
    var real_salary = this.data.realtotal;
    var price = this.data.inpuPrice;
    if (price == '' || price == undefined) {
      wx.showToast({
        title: '请先填写课程单价',
        icon: 'none'
      })

      this.setData({
        youhui: 100
      })
      return false;
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
        success: function () {

          that.setData({
            discount: 1,
            youhui: 100,
            realtotal: parseFloat(total),
            free_money: 0,
            hasfree: 0
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
      var has_free = total - parseFloat(d) + parseFloat(o);
      //var rea = parseInt(total) - has_free + parseFloat(fee);
      var rea = total - (total - parseFloat(d)) - parseFloat(o) + parseFloat(fee)

      this.setData({
        discount: discount,
        realtotal: rea,
        hasfree: has_free
      })

    } else if (discount == 0 || discount == '' || discount == null) {
      wx.showToast({
        title: '折扣不能为0',
        icon: 'none',
        success: function () {
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
  free_money: function (e) {
    var discount = this.data.discount;
    var fee = this.data.fee;
    var fee = Number(fee);

    var o = e.detail.value;
    var o = Number(o);
    var total = this.data.total;
    var total = Number(total);
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
          hasfree: 0,
          free_money: 0
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

      } else {
        this.setData({
          discount: 1,
          realtotal: rea,
          hasfree: o,
          free_money: o
        })
      }


    }

  },
  otherFee: function (e) {
    var that = this;
    var fee = e.detail.value;
    var discount = this.data.discount;
    var o = this.data.free_money;
    var total = this.data.total;
    var d = parseFloat(total) * discount;
    // if (fee = '') {
    //   var fee = 0;
    // }

    console.log(discount);
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

    console.log(fee)
    if (fee != '' && discount == 1) {
      var fee = e.detail.value;
      console.log(fee+'hhh');
      var sbbs = parseInt(total) + parseInt(fee);
      var rea = sbbs - parseFloat(o);
      console.log(sbbs);
      console.log(total)
      console.log(fee)
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
  intotal: function (e) {
    var total = e.detail.value;
    this.setData({
      total: total
    })
  },
  //hasCoursed
  hasCoursed: function (e) {
    var already_lesson = e.detail.value;
    this.setData({
      already_lesson: already_lesson
    })
  },
  remark: function (e) {
    var remark = e.detail.value;
    this.setData({
      remark: remark
    })
  },
  dateChange: function (e) {
    this.setData({
      utime: e.detail.value
    })
  },
  subData: function (price, order_id, product_id, num, real_salary, discount, free_money, fee, student_id, already_lesson, remark, signtime,total) {
    ///
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + '/api/backend.lesson_order/edit_order',
      method: 'POST',
      header: {
        token: token
      },
      data: {
        signtime: signtime,
        price: price,
        order_id: order_id,
        product_id: product_id,
        //num: num,
        real_salary: real_salary,
        discount: discount,
        free_money: free_money,
        fee: fee,
        student_id: student_id,
        already_lesson: already_lesson,
        remark: remark,
        total: total
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            duration: 1000,
            success: function () {
              wx.removeStorageSync('choosedPro')
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
  submits: function () {
    var that = this;
    var order_id = that.data.order_id;
    var order_title = that.data.order_title;
    var num = that.data.num;
    var product_id = that.data.pid;
    var price = this.data.inpuPrice;
    var signtime = this.data.utime;

    var lesson_count = that.data.lesson_count;

    var student_id = that.data.student_info.id;

    var discount = that.data.discount;
    // var discount = shift/100;


    var free_money = that.data.free_money;
    var fee = that.data.fee;
    var real_salary = that.data.realtotal;
    var already_lesson = that.data.already_lesson;
    var remark = that.data.remark;
    var total=this.data.total;

    
    if (num == '' || num == undefined) {
      wx.showToast({
        title: '请输入课时数',
        icon: 'none'
      })
    }else if (price == '' || price == undefined) {
      wx.showToast({
        title: '请输入课程价格',
        icon: 'none'
      })
    } else if (student_id == '') {
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
      //验证通过后提交数据
      that.subData(price, order_id, product_id, num, real_salary, discount, free_money, fee, student_id, already_lesson, remark, signtime, total)

    }
  },
  addStu: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../stuList/stuList?stuId=' + id,
    })
  },
  select: function () {
    wx.showToast({
      title: '学员不可修改',
      icon:'none'
    })
    // wx.navigateTo({
    //   url: '../stuList/stuList',
    // })
  },
  keshiNum: function (e) {
    var hour = e.detail.value;
    
  
    var price = this.data.price;
    var summary = hour * price;
    console.log(summary);
    if (hour == '') {
      wx.showToast({
        title: '课时数不能为空',
        icon: 'none'
      })

      this.setData({
        place:'',
        num: '',
        realtotal: summary,
        hasfree: 0,
        free_money: 0,
        discount: 1,
        // youhui:100,
        total: summary,
        summaryPrice: summary,
        fee: 0
      })

      return '';
    }else{


      this.setData({
        num: hour,
        summaryPrice: summary,
        total: summary,
        realtotal: summary
      })

    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.order_id;
    var order_title = options.order_title;
    var num = options.num;
    var pid = options.pid;
    var status = options.status;
    var utime = options.utime;
    var total=options.total;

    var lesson_count = options.lesson_count;
    var money = options.money;
    var price = options.price;

    //var student_info = options.stuInfo;
    //var newStuInfo = JSON.parse(student_info);
    var student_info = options.stuInfo;
    var newStuInfo = JSON.parse(student_info)
    console.log(newStuInfo);

    var muti_choose = [{
      id: newStuInfo.id,
      avatar: newStuInfo.avatar,
      username: newStuInfo.username
    }]



    var discount = options.discount;
    var oType = options.type;
    var free_money = options.free_money;
    var fee = options.fee;
    var total = options.total;
    var money = options.money;
    var already_lesson = options.already_lesson;
    //var realDiscount = discount/100;
    var remark = options.remark;
    var courseSum = price * num;
    var hasf = parseFloat(courseSum) - parseFloat(courseSum * discount) + parseFloat(free_money);
    that.setData({
      summaryPrice: price * num,
      status: status,
      hasfree: hasf,
      order_type: oType,
      order_id: order_id,
      order_title: order_title,
      price: price,
      inpuPrice: price,
      lesson_count: lesson_count,
      money: money,
      student_info: newStuInfo,
      discount: discount,
      free_money: free_money,
      fee: fee,
      total: total,
      already_lesson: already_lesson,
      remark: remark,
      num: num,
      pid: pid,
      realtotal: money,
      muti_choose: muti_choose,
      utime: utime
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
    var courseval = wx.getStorageSync('courseval');
    var name = courseval.val;
    var id = courseval.id;

    if (courseval) {
      this.setData({
        order_title: name,
        pid: id
      })
    }

    var that = this;
    var addStu = wx.getStorageSync('addStu');
    if (addStu != '') {
      that.setData({
        muti_choose: addStu
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
    wx.removeStorageSync('courseval')
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