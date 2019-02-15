//index.js
//获取应用实例
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    //hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data:'',
    data2:''
  },
  homework:function(){
    wx.navigateTo({
      url: '../homework/homework',
    })
  },
  addstu:function(){
    wx.navigateTo({
      url: '../createStu/createStu',
    })
  },
  order:function(){
    wx.navigateTo({
      url: '../chooseClass/chooseClass?'+'from_page=order',
    })
  },
  getNowFormatDate: function () {
    //var token = wx.getStorageSync('token');
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
    var currentdate = year + seperator1 + month;
    this.getSum(currentdate)
    this.getSum2(currentdate)
    this.setData({
      date: currentdate,
      date2: currentdate
    })
    //this.getlesson('', '', '');
    return currentdate;
  },
  bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
    this.getSum(e.detail.value)
  },
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value
    })
    this.getSum2(e.detail.value)
  },
  refreshToken:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + '/api/token/refresh',
      method: 'POST',
      header: {
        token: token
      },
      data: {

      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.setStorageSync('token', res.data.data.token)
        }else if(res.data.code==401){
          wx.removeStorageSync('token');
          wx.showToast({
            title: 'token已失效，重新登录',
            duration:1000,
            success:function(){
              wx.reLaunch({
                url: '../login/login',
              })
            }
          })
        }
      }
    })
  },
  async getSum(date) {
    var token = wx.getStorageSync('token');
    
    const data = await utils.get("/api/finance/get_data", {
      month: date
    }, token);
    this.setData({
      moneySum: data.data
    })
  
  },
  async getSum2(date2) {
    var token = wx.getStorageSync('token');

    const data = await utils.get("/api/finance/statistic_class", {
      month: date2
    }, token);
    // console.log(data.data);
    this.setData({
      keshiSum: data.data
    })
    //console.log(data)
  },

  classManage:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    if (token == undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../classManage/classManage',
      })
    }
  },
  classRoom:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    if (token == undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../roomManage/roomManage',
      })
    }
  },
  //事件处理函数
  ctypes:function(){
    const token = wx.getStorageSync('token');
    if (token == undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      wx.navigateTo({
        url: '../courseType/CourseType',
      })
    }
  },
  toPractice:function(){
    wx.navigateTo({
      url: '../prctice/prctice',
    })
  },
  arrange: function() {
    const token = wx.getStorageSync('token');
    if (token == undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      wx.navigateTo({
        url: '../test/test'
      })
    }
  },
  teacher:function(){
    const token = wx.getStorageSync('token');
    if (token === undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }{
      wx.navigateTo({
        url: '../teacher/teacher'
      })
    }
   
  },
  
  sign:function(){
    const token = wx.getStorageSync('token');
    if (token == undefined || token == null || token == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }{
      wx.navigateTo({
        url: '../signs/signs'
      })
    }
    
  },
  loadRules: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var group_id = wx.getStorageSync('userinfo').group.id;
    wx.request({
      url: baseUrl + '/api/user_role/get_list',
      method: 'post',
      data: {
        group_id: 4
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: token
      },
      success: function (res) {
        if (res.data.code == 1) {
          var datas = res.data.data;
          var checkPower = that.data.power;
          // for (var i = 0; i < datas.length; i++) {
          //   datas[i].state = 0;
          //   for (var j = 0; j < checkPower.length; j++) {
          //     if (datas[i].id == checkPower[j].id) {
          //       datas[i].state = 1;
          //     }
          //   }
          // }



          that.setData({
            ruleList: datas
          })
        }
      }
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载中',
    })
    wx.removeStorageSync('addStu')
    var token=wx.getStorageSync('token');
    var is_new=wx.getStorageSync('is_new')
    this.getNowFormatDate();
    if (token){
      this.refreshToken();
    }
  
   if (token == undefined || token == null || token == '') {
      wx.reLaunch({
        url: '../login/login',
      })
    }

    if (token && is_new==1){
      wx.reLaunch({
        url: '../loginNew/loginNew',
      })
    }
    
  
  },
  onShow: function () {
    var token = wx.getStorageSync('token');
    wx.removeStorageSync('courseval');
    this.getNowFormatDate();
    this.getInfo();
    if (token == undefined || token == null || token == '') {
      wx.reLaunch({
        url: '../login/login',
      })
    }
  },
  // getUserInfo: function(e) {
  //   //console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })

  //   //
  // },
  keshiTongji() {
    wx.navigateTo({
      url: '../Keshistatic/Keshistatic'
    });
  },
  getInfo: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + '/api/user/getUserInfo',
      method: 'get',
      header: {
        token: token
      },
      data: {

      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          //console.log(res.data.data)
          var datas = res.data.data;
          var userinfo = datas.userinfo;
          //console.log(datas.userinfo.group.rules)
          var myRule = datas.userinfo.group.rules;
          
          var newRule = myRule.split(',')
          newRule.sort(function (a, b) {
            // order是规则  objs是需要排序的数组
            var order = ['103', '91', '95', '102', '88', '92', '93','100'];
            return order.indexOf(a) - order.indexOf(b);
          });
          var sb=[]

          // 根据规则排序后新的数组
          var result = newRule.map(function (a) {
            //console.log(a)
            sb.push(a)
            return a;
          });
          console.log(sb)
         
          that.setData({
            myRule: sb
          })
          wx.setStorageSync('myrule', newRule);
          //that.loadRules();
          
          if (userinfo.agency.name == '' || userinfo.agency.name == undefined || userinfo.agency.name==null){
            wx.reLaunch({
              url: '../selectAgency/selectAgency',
            })
          }
          if (userinfo.agency.member==1){
            wx.reLaunch({
              url: '../selectAgency/selectAgency?fromPage='+'index',
            })
          }

        }else{

          // wx.reLaunch({
          //   url: '../login/login',
          // })
        }
      }
    })
  },
  onShareAppMessage: function () {
    wx.switchTab({
      url: '../index/index',
    })
  }
})
