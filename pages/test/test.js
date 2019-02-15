// pages/test/test.js
let app = getApp();
var page=1;
let baseUrl = app.globalData.baseUrl;
const utils = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/runtime')
Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    cell:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
    list: [
      {
        id: '0',
        title: '日课表'
      },
      {
        id: '1',
        title: '周课表'
      }
    ],
    selectedId: '0',
    teacher_id:'',
    scroll: true,
    fixed: true,
    height: 44,
    date: '',
    index:'',
    roomIndex:'',
    cur:0,
    roomShow:false
  },
  onPageScroll(res) {
    console.log(res)
  },

  signdetail:function(e){
    var id=e.currentTarget.dataset.id;
    //console.log(e);
    wx.navigateTo({
      url: '../signDetail/signDetail?id='+id,
    })
  },
  slectWay:function(e){
    var inde=e.currentTarget.dataset.index;
    this.setData({
      cur:inde
    })
    console.log(inde);
    var shedule_type = this.data.shedule_type;
    var date=this.data.date;
    var tid = this.data.teacher_id;
    var selectedId = this.data.selectedId;
    var roomId=this.data.roomId;

    if ( shedule_type==1){
      var date = this.data.date2;
    }

    if (selectedId == 1 && inde==1){
      var tid = '';
      this.setData({
        roomShow:true
      })
    }
    //周课表 按老师
    if (selectedId == 1 && inde == 0) {
      this.setData({
        roomShow: false
      })
    }

    if (shedule_type==0){
      var roomId='';
      var tid=''
    }
    if (shedule_type == 0 && inde==1) {
      var tid = '';
    }

    if (shedule_type == 1 && inde==0){
      var roomId = '';
      this.setData({
        roomShow: false
      })
    } else if (shedule_type == 1 && inde == 1){
      this.setData({
        roomShow: true
      })
    }

    


    this.getDetail(inde, shedule_type, tid, date, roomId);
  },
  getNowFormatDate: function () {
    var token = wx.getStorageSync('token');
    var filter=this.data.cur;
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
    var tid = this.data.teacher_id;
    var currentdate = year + seperator1 + month + seperator1 + strDate;

    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dateStr = currentdate;
    var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    var week = weekDay[myDate.getDay()];

    this.setData({
      date: currentdate,
      date2: currentdate,
      week:week,
      week2:week
    })

    this.getDetail(filter, 0, tid, currentdate, '');

    return currentdate;
  },
  change: function (e) {
    //console.log(e.detail.current);
    var cur = e.detail.current;
    var isTorC = this.data.cur;
    var date = this.data.date;
    var tid = this.data.teacher_id;
    var roomId = this.data.roomId;
    this.setData({
      selectedId: cur,
      shedule_type: cur
    })

    console.log(cur)

    

    if (cur == 1) {
      this.getDetail(1, cur, '', date, roomId);
    }

    // if (val == 1 && cur == 0) {
    //   this.getDetail(cur, 1, tid, date, '');
    // }
    // if (val == 1 && cur == 1) {
    //   this.getDetail(cur, 1, '', date, roomId);
    // }
    
    
    
    //this.getList(cur);
  },
  tabchange: function (e) {
    var val = e.detail;
    var cur=this.data.cur;
    var date=this.data.date;
    var tid = this.data.teacher_id;
    var roomId = this.data.roomId;
    var cur=this.data.cur;
    this.setData({
      selectedId: e.detail,
      shedule_type: e.detail
    })
    //console.log(cur)

   
    
    if (val == 1) {
      this.getDetail(1, 1, '', date, roomId);
    }
  },
  
  bindDateChange: function (e) {
    var cur = this.data.cur;
    var shedule_type = this.data.shedule_type;
    var date = e.detail.value;
    var teacher_id = this.data.teacher_id;

    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dateStr = date;
    var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    var week=weekDay[myDate.getDay()];
    this.setData({
      date: e.detail.value,
      week:week
    })

    this.getDetail(cur, shedule_type, teacher_id, date, '');
  },
  bindDateChange2:function(e){
    var cur = this.data.cur;
    var shedule_type = this.data.shedule_type;
    var date = e.detail.value;
    var teacher_id=this.data.teacher_id;
    var roomId = this.data.roomId;

    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dateStr = date;
    var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    var week = weekDay[myDate.getDay()];

    this.setData({
      date2: e.detail.value,
      week2: week
    })

    // if(cur==0){
    //   var roomId=''
    // }else if(cur==1){
    //   var teacher_id=''
    // }

    this.getDetail(cur, shedule_type, teacher_id, date, roomId);
  },
  teacherChange:function(e){
    var list=this.data.teacherList;
    var index=e.detail.value;
    var tid = list[index].teacher_id;
    var cur=this.data.cur;
    this.setData({
      index: e.detail.value,
      teacher_id:tid
    })
    var date = this.data.date2;
    var filter=this.data.cur;
    var shedule_type = this.data.shedule_type;
    this.getDetail(cur, shedule_type, tid, date, '');
  },
  roomChange: function (e) {
    var list = this.data.roomList;
    var index = e.detail.value;
    var roomId = list[index].id;
    var cur = this.data.cur;
    this.setData({
      roomIndex: e.detail.value,
      roomId: roomId
    })
    var date = this.data.date;
    var filter = this.data.cur;
    var shedule_type = this.data.shedule_type;
    this.getDetail(1, shedule_type, '', date, roomId);
  },
  async getTlist(){
    var token = wx.getStorageSync('token');
    const data =await utils.get('teacher/get_list',{
      page:1,
      page_size:20,
      filter:2
    },token);

    //console.log(data)

    var tid = data.data.data[0].teacher_id;
    var tList = data.data.data;

    if (tid == '' || tid==undefined){
      var tid=''
    }

    if (tList.length == 0 || tList==undefined){
      var tList=[{
        id:'',
        username:'暂无老师'
      }]
    }

    if(data.code==1){
      this.setData({
        teacherList: tList,
        teacher_id: tid
      })
    }
  },
  async getroomList() {
    var token = wx.getStorageSync('token');
    const data = await utils.get('class_room/get_list', {
      page: 1,
      page_size: 20
    }, token);

    // console.log(data);
    var rId = data.data[0].id;
    var RList = data.data;
    if(rId==null || rId==undefined){
      var rId='';
    }

    if (RList.length == 0 || RList == undefined) {
      var tList = [{
        id: '',
        username: '暂无教室'
      }]
    }

    if (data.code == 1) {
      this.setData({
        roomList: RList,
        roomId: rId
      })
    }
  },

  async getDetails(cur, type, tid, startdate, roomId){
    var token= wx.getStorageSync('token');
    const data = await utils.post('shedule/get_shedule_day_date',{
      shedule_type:type,
      filter_type:cur,
      teacher_id:tid,
      startdate:startdate,
      class_room: roomId
    },token);
    var list=data.data;
   if(type==1){
     this.setData({
       weeklist: list
     })
   }else{
     this.setData({
       dayList: list
     })
   }
  },

  getDetail: function (cur, type, tid, startdate, roomId){
    var token = wx.getStorageSync('token');
    var that=this;
    wx.request({
      url: baseUrl +'shedule/get_shedule_day_date',
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded',
        "token": token
      },
      data:{
        shedule_type: type,
        filter_type: cur,
        teacher_id: tid,
        startdate: startdate,
        class_room: roomId
        //platform: 1
      },
      success:function(data){
        var list = data.data.data;
        
        if (type == 1) {
          that.setData({
            weeklist: list
          })
        } else {
          that.setData({
            dayList: list
          })
        }
      }
    })
  },
  addNew:function(){
    wx.navigateTo({
      url: '../addArrange/addArange',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      shedule_type: 0
    })
    this.getNowFormatDate();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // 设置紫色框 scroll-view 的高度
          wHeight: (res.windowHeight - 40)
        })
      }
    })

    

    this.getTlist();
    this.getroomList();

    
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
    //this.getNowFormatDate();
    var filter = this.data.cur;
    var shedule_type = this.data.shedule_type;
    var teacher_id = this.data.teacher_id;
    var roomId = this.data.roomId;
    var date=this.data.date;
    if (filter==0){
      var roomId='';
    }
    if (shedule_type==0){
      var teacher_id=''
    }


    var is_onshow=wx.getStorageSync('addPaike');
    if (is_onshow){
      this.getDetail(filter, shedule_type, teacher_id, date, roomId);
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
    wx.removeStorageSync('addPaike');
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
  
  },
  onPageScroll: function (res) {
    // Do something when page scroll
    console.log('res')
  },
})