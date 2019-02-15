// pages/order/order.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')

const regeneratorRuntime = require('../../lib/runtime')
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModel:false,
    cur:'',
    index:'',
    Tindex:'',
    statuindex:'',
    contarct:[
      {
        id:'',
        typeTxt:'全部类型'
      },
      {
        id:1,
        typeTxt:'新增'
      },
      {
        id:2,
        typeTxt:'续签'
      },
      {
        id:3,
        typeTxt:'赠送'
      },
    ],
    status:[
      {
        id: '',
        txt: '全部'
      },
      
      {
        id:1,
        txt:'正常'
      },
      {
        id:2,
        txt:'退款'
      }
    ],
    w_cur: '',
    stuType_cur: '',
    lesson_cur:'',
    noResult:'',
    hasMoreData: true,
    page_size:10,
    page:1,
    contentlist:[],
    satrtdate:'',
    enddate:'',
    name:''
  },
  
  addOrder:function(){
    wx.navigateTo({
      url: '../chooseClass/chooseClass?from_page=order'
    });
  },
  select:function(){
    var model=this.data.showModel;
    var that=this;
    if(model){
      that.setData({
        showModel:false
      })
    }else{
      that.setData({
        showModel:true
      })
    }
  },
  canceModel:function(){
    this.setData({
      showModel:false
    })
  },
  sendModel:function(){
    var startDate = this.data.satrtdate;
    var enddate=this.data.enddate;
    var lesson_name =this.data.lesson_name;
    var lesson_id = this.data.lesson_cur;
    var contractId = this.data.stuType_cur;//订单类型
    var status = this.data.w_cur;//是否退费
    var name=this.data.name;
    
    this.setData({
      showModel:false,
      showModalStatus: false
    })
    this.shaiCon(startDate, enddate, lesson_id, contractId, name, status, 1, 10);
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
    var d=new Date(date); 
    d.setDate(d.getDate()-7); 
    var m=d.getMonth()+1; 

    var startY=d.getFullYear();
    var startM=d.getMonth()+1;
    var startD=d.getDate();

    if(startM >= 1 && startM <= 9){
      startM = "0" + startM;
    }
    if (startD >= 0 && startD <= 9) {
      startD = "0" + startD;
    }

    var sb=startY+'-'+startM+'-'+startD; 
    
    // this.setData({
    //   satrtdate: sb,
    //   enddate:currentdate
    // })

    
    this.getOrderList('','','','','','',1,10);
    return currentdate;
  },
  startChange: function (e) {
  
    this.setData({
      satrtdate: e.detail.value
    })
  },
  endChange: function (e) {
    
    this.setData({
      enddate: e.detail.value
    })
  },
  lessonChange:function(e){
    var list = this.data.lessonList;
    var index = e.detail.value;
    var lesson_name = list[index].name;
    var lesson_id = list[index].id;
    this.setData({
      index: e.detail.value,
      lesson_name: lesson_name,
      lesson_id: lesson_id
    })
    //this.getlesson(lessonId, teacherId,date);
  },
  contractChange:function(e){
    var list=this.data.contarct;
    var index = e.detail.value;
    var contractId=list[index].id;
    var typeTxt = list[index].typeTxt;
    this.setData({
      Tindex:index,
      contractId:contractId,
      typeTxt: typeTxt
    })
  },
  typeChange: function (e) {
    var list = this.data.status;
    var index=e.detail.value;
    var status = list[index].id;
    var typeTxt = list[index].txt;
    this.setData({
      statuindex: e.detail.value,
      orderstatus: status,
      ordertxt: typeTxt
    })


  },
  getlesson: function (){
    var token = wx.getStorageSync('token');
    var that=this;
    

    wx.request({
      url: baseUrl +'/api/lesson/get_list',
      method:'get',
      header:{
        token: token
      },
      data:{
        page:page,
        page_size:100,
      },
      success:function(res){
        var list =res.data.data;
        if(res.data.code==1){
          that.setData({
            lessonList:list
          })

          wx.hideLoading();
        }
      }
    })
  },
  searchName: function (e) {
    wx.showLoading({
      title: '正在搜索中',
    })
    var name = e.detail.value;
    this.setData({
      keyword:e.detail.value,
      contentlist:[],
      name:name,
      page:1
    })
    this.getOrderList('', '', '', '', name, '', 1, 10);
  },
  inpuName:function(e){
    var name = e.detail.value;
    this.setData({
      keyword: e.detail.value,
      contentlist: [],
      name: name,
      page: 1
    })
    this.getOrderList('', '', '', '', name, '', 1, 10);
  },
  async getOrderList(startdate, enddate, lesson_id, contract, key, status,page,page_size) {
    var date = this.data.nowDate;
    var token=wx.getStorageSync('token');
    var that=this;
    const data = await utils.get("/api/backend.lesson_order/get_order_list", {
      status: status,
      startdate: startdate,
      enddate: enddate,
      contract_type:contract,
      lesson_id: lesson_id,
      keyword:key,
      page:page,
      page_size:page_size
    },token);
    if(data.code==1){
      wx.hideLoading();
    }
    var contentlistTem = that.data.contentlist;

    if (that.data.page == 1) {
      contentlistTem = []
    }
    
    var contentlist = data.data.data;
    if (contentlist.length==0){
      this.setData({
        noResult: true
      })
    }

    if (contentlist.length < that.data.page_size) {
      that.setData({
        contentlist: contentlistTem.concat(contentlist),
        hasMoreData: false
      })
      console.log('haha')
    } else {
      that.setData({
        contentlist: contentlistTem.concat(contentlist),
        hasMoreData: true,
        page: that.data.page + 1
      })
    }
  },
  async shaiCon(startdate, enddate, lesson_id, contract, key, status, page, page_size){
    var date = this.data.nowDate;
    var token = wx.getStorageSync('token');
    var that = this;
    that.setData({
      page:1
    })
    const data = await utils.get("/api/backend.lesson_order/get_order_list", {
      status: status,
      startdate: startdate,
      enddate: enddate,
      contract_type: contract,
      lesson_id: lesson_id,
      keyword: key,
      page: page,
      page_size: page_size
    }, token);
    if(data.code==1){
      wx.showToast({
        title: data.msg,
        icon:'none'
      })
    }
    if (data.data.data.length==0){
      this.setData({
        noResult:true
      })
    }


    if (that.data.page == 1) {
      var contentlistTem = [];
      this.setData({
        contentlist:[]
      })
    }else{
      var contentlistTem = that.data.contentlist;
    }
    var contentlist = data.data.data;
    console.log(contentlist);

    if (contentlist.length < that.data.page_size) {
      that.setData({
        contentlist: contentlistTem.concat(contentlist),
        hasMoreData: false
      })
    } else {
      that.setData({
        contentlist: contentlistTem.concat(contentlist),
        hasMoreData: true,
        page: that.data.page + 1
      })
    }

    
  },
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../recordDetail/recordDetail?' + 'id=' + id,
    })
  },
  close:function(e){
    var froms=e.currentTarget.dataset.close;
    var contract = this.data.contractId;
    var lesson_name = this.data.lesson_name;
    var lesson_id = this.data.lesson_id;
    var status = this.data.statuindex;
    var startdate=this.data.startdate;
    var enddate = this.data.enddate;
    var keyword=this.data.keyword;
    var index=e.currentTarget.dataset.index;
    var page=this.data.page;
    var page_size=this.data.page_size;
      this.setData({
        cur:index
      })
      
    if (froms =="lessonName"){
      this.getOrderList(startdate, enddate, '', contract, keyword, status,page,page_size);
      this.setData({
        lesson_name:''
      })
    } else if (froms == "contarct"){
      this.getOrderList(startdate, enddate, lesson_id, '', keyword, status, page, page_size);
      this.setData({
        contractId: ''
      })
    } else if (froms == "order") {
      this.getOrderList(startdate, enddate, lesson_id, contract, keyword, '', page, page_size);
      this.setData({
        statuindex: ''
      })
    } else if (froms == "keyword") {
      this.getOrderList(startdate, enddate, lesson_id, contract, '', status, page, page_size);
      this.setData({
        keyword: ''
      })
    }

  },
  setModalStatus: function (e) {
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
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  reBack: function (e) {
    var w_index = e.currentTarget.dataset.w_index;
    var w_curs = this.data.w_cur;
    if (w_index != w_curs) {
      this.setData({
        w_cur: w_index
      })
    } else {
      this.setData({
        w_cur: ''
      })
    }

  },
  stuType: function (e) {
    var stuType = e.currentTarget.dataset.learn_status;
    var stuCur = this.data.stuType_cur;
    if (stuType != stuCur) {
      this.setData({
        stuType_cur: stuType
      })
    } else {
      this.setData({
        stuType_cur: ''
      })
    }

  },
  keshiNum: function (e) {
    var keshi = e.detail.value;
    this.setData({
      keshiNum: keshi
    })
  },
  slectCourses:function(e){
    var lesson_id=e.currentTarget.dataset.id;
    var lesson_curs=this.data.lesson_cur;
    if (lesson_curs != lesson_id){
      this.setData({
        lesson_cur: lesson_id
      })
    }else{
      this.setData({
        lesson_cur: ''
      })
    }
  },
  reset: function () {
    this.setData({
      w_cur: '',
      stuType_cur: '',
      keshiNum: '',
      lesson_cur:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startdate=this.data.startdate;
    var enddate=this.data.enddate;

    var myrule = wx.getStorageSync('myrule');
    //console.log(myrule);
    for (var i = 0; i < myrule.length; i++) {
      if (myrule[i] == 88) {
        var hasrule = true;
      }
    }
    if (hasrule) {
      this.setData({
        hasrule: hasrule
      })
    }
    
    //this.getNowFormatDate();
    this.getlesson();
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
    this.setData({
      contentlist:[],
      page:1
    })
    this.getNowFormatDate();
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
    wx.removeStorageSync('courseval');
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
    
    var page=this.data.page;
    var page_sie=this.data.page_size;
    var name=this.data.name;
    var contract_type=this.data.stuType_cur;
    var start=this.data.startdate;
    var end=this.data.enddate;
    var lesson=this.data.lesson_cur;
    var status=this.data.w_cur;
    if (this.data.hasMoreData) {
      this.getOrderList(start, end, lesson, contract_type, name, status, page, page_sie);
    } else {
      // wx.showToast({
      //   title: '没有更多数据了',
      //   icon:'none'
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})