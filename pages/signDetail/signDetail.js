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
    unsure:'未确认',
    showAlert:false,
    statuIndex:null,
    deductIndex:0,
    deducted:1,
    statuId:'',
    deduct:[
      {
        id:1,
        txt:'扣课时'
      },
      {
        id:0,
        txt:'不扣课时'
      }
    ],
    statu:[
      {
        id:0,
        statusTxt:'未确认'
      },
      {
        id: 1,
        statusTxt: '已到达'
      },
      {
        id: 2,
        statusTxt: '请假'
      },
      {
        id: 5,
        statusTxt: '旷课'
      },
    ],
    menuShow:false
  },
  //布置作业
  sendwork(e){
    var oldDetail=e.currentTarget.dataset.detail;
    var detail = JSON.stringify(oldDetail);
    var index=e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../sendhomework/sendhomework?'+'detail='+detail+'&index='+index,
    })
  },
  acts:function(){
    var is_show = this.data.menuShow;
    if (is_show==false){
      this.setData({
        menuShow: true
      })
    }else{
      this.setData({
        menuShow: false
      })
    }
   
  },
  delateKejie(e){
    var sid=e.currentTarget.dataset.sid;
    var that=this;
    var id = this.data.id;
    wx.showModal({
      title: '提示',
      content: '删除课节后不可恢复，您确定要删除？',
      success:function(res){
        if(res.confirm){
          that.delates(sid)
        }else{
          that.setData({
            menuShow: false
          })
        }
      }
    })
   
  },
  async delates(sid){
    var token = wx.getStorageSync('token')
    // const data = await utils.post('shedule/delete_shedule', {
    //   shedule_id: sid,
    // }, token);
    wx.request({
      url: baseUrl + 'shedule/delete_shedule',
      method: 'POST',
      header: {
        token: token,
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        shedule_id: sid,
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.setStorageSync('addPaike', 'success')
          wx.showToast({
            title: res.data.msg,
            success: function () {
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


    // if (data.code == 1) {
    //   wx.showToast({
    //     title: '操作成功'
    //   })
    // } else {
    //   wx.showToast({
    //     title: data.msg,
    //     icon: 'none'
    //   })
    // }
    
  },
  editKejie(e){
    var olddetail=e.currentTarget.dataset.detail;
    var detail=JSON.stringify(olddetail)
    wx.navigateTo({
      url: '../editKejie/editKejie?' +'detail='+detail,
    })
  },
  comment:function(e){
    var comment_status=e.currentTarget.dataset.comment_status;
    var shedule_id = e.currentTarget.dataset.shedule_id;
    var student_id = e.currentTarget.dataset.student_id; 
    //var isJieke = this.data.signDetail.status;
    var is_sign = e.currentTarget.dataset.sign_status;
    console.log(is_sign);
    if (is_sign!=1){
      wx.showToast({
        title: '请先完成签到已到达才能课评',
        icon:'none'
      })
    } else if (is_sign == 1 && comment_status==0){
      //if (is_sign == 1) {
        wx.navigateTo({
          url: '../courseComment/courseComment?' + 'comment_status=' + comment_status + '&shedule_id=' + shedule_id + '&student_id=' + student_id,
        })
      //}
    } else if (is_sign == 1 && comment_status == 1){
      wx.navigateTo({
        url: '../editCourseComment/editCourseComment?' + 'comment_status=' + comment_status + '&shedule_id=' + shedule_id + '&student_id=' + student_id,
      })
    }
    
  },
  checkWork(e){
    var id=e.currentTarget.dataset.id;
    var sid = e.currentTarget.dataset.sid;

    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail?'+'pid='+id+'&sid='+sid,
    })
  },
  async addSign (shedule_id, student_id, status, is_deduct){
    var token=wx.getStorageSync('token')
    var id=this.data.id;
    const data = await utils.post('sign/add',{
      shedule_id: shedule_id,
      student_id: student_id,
      status: status,
      is_deduct: is_deduct
    },token);
    if(data.code==1){
      wx.showToast({
        title: '操作成功'
      })

      this.getDetail(id)
      this.setData({
        showAlert: false,
      })
    }
  },
  
  selectStatu:function(e){
    var cur = e.currentTarget.dataset.stacur;
    var list = this.data.statu;
    var statuId = list[cur].id;
    this.setData({
      statuIndex: cur,
      statuId: statuId
    })
  },
  deduct:function(e){
    var cur = e.currentTarget.dataset.deindex;
    var list = this.data.deduct;
    console.log(list);
    var deducted = list[cur].id;

    this.setData({
      deductIndex: cur,
      deducted: deducted
    })
  },
  Tosign:function(e){
    var shedule_id = e.currentTarget.dataset.shedule_id;
    var stuId=e.currentTarget.dataset.student_id;
    var isJieke = this.data.signDetail.status;
    if (isJieke==1){
      this.setData({
        showAlert: true,
        shedule_id: shedule_id,
        student_id: stuId
      })
    }else{
      wx.showToast({
        title: '该课节已结课',
        icon:'none'
      })
    }
  },

  cancel:function(){
    this.setData({
      showAlert: false
    })
  },
  sure:function(){
    var status = this.data.statuIndex;
    var deduct=this.data.deductIndex;
    var deducted=this.data.deducted;
    var stuId=this.data.student_id;
    var shedule_id = this.data.shedule_id;
    var id=this.data.id;
    var statuId = this.data.statuId;

    if (statuId == null || statuId==''){
      wx.showToast({
        title: '请选择签到状态',
        icon:'none'
      })
    }else{
      this.setData({
        showAlert: false
      })
      this.addSign(shedule_id, stuId, statuId, deducted);
      this.getDetail(id)
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var that = this;
    if (options.detail){
      var details = options.detail;
      var detail = JSON.parse(details)
    }
    
    //this.getDetail(options.id)

    wx.setNavigationBarTitle({
      title: '签到详情',
      success: function(res) {},
    })
    this.setData({
      // detail:detail,
      id:options.id
    })
  },
  async jiekes(shedule_id,status){
    var token = wx.getStorageSync('token');
    var that=this;
    const data = await utils.post('shedule/finish_shedule',{
      shedule_id: shedule_id,
      status:status
    },token);
    if(data.code==1){
      var id=this.data.id;
      that.getDetail(id);
      wx.showToast({
        title: data.msg,
        duration:1000,
        success:function(){
          that.getDetail(id)
        }
      })
    }else{
      wx.showToast({
        title: data.msg,
        icon:'none'
      })
    }
  },
  async getDetail(id){
    var token = wx.getStorageSync('token');
    const data = await utils.get('shedule/get_detail',{
      shedule_id:id
    },token);
    if(data.code==1){
      this.setData({
        signDetail:data.data
      })
    }
  },
  jieke:function(e){
    var status = this.data.signDetail.status;
    var that=this;
    if (status==1){
      var status=2;
      var txt = "您确定要结课吗"
    } else if (status==2){
      var status=1;
      var txt="您确定要取消结课状态吗"
    }
    var shedule_id = this.data.signDetail.id;
    wx.showModal({
      title: '提示',
      content: txt,
      success:function(res){
        
        if (res.confirm) {
          that.jiekes(shedule_id, status);
        }
        
      }
    })
  },
  bindPickerChange:function(e){
    //console.log(e);
    var that=this;
    var arr = this.data.statu  //数组;
    var value = e.detail.value;     //数组子集
    var index = e.currentTarget.dataset.index;  //索引
    var shedule_id = e.currentTarget.dataset.shedule_id; 
    var student_id = e.currentTarget.dataset.student_id; 
    var newVal = arr[value].statusTxt;
    var newValId = arr[value].id;
    var muti = this.data.multi_choose;
      
    muti[index].shedule_info.sign_status_text = newVal;
    muti[index].shedule_info.sign_status = newValId;
  
    //that.sign(shedule_id, student_id, newValId)

    var token = wx.getStorageSync('token');
    wx.request({
      url: baseUrl + 'sign/add',
      method: 'POST',
      header: {
        token: token
      },
      data: {
        shedule_id: shedule_id,
        student_id: student_id,
        status: newValId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            multi_choose: muti
          })

          wx.showToast({
            title: '操作成功',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '../../images/warn.png'
          })
        }
      }
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
    var id = this.data.id;
    this.getDetail(id);
    // this.setData({
    //   menuShow: false
    // })
    wx.removeStorageSync('addStu');
    wx.removeStorageSync('selecedTeacher');
    wx.removeStorageSync('courseval');
    wx.removeStorageSync('selectRoom');
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