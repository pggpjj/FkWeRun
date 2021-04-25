// pages/daka/daka.js
var Calendar = require("../../service/Calendar.js");
var Server = require("../../service/Server.js");
var util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthCur: 'cur-navigate-item',
    totalCur: '',
    showTotal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
    
  },

  //初始化日历
  initCalendar: function (paramDate) {
    //当前年月日
    var now = new Date();//当前时间
    var nowMonth = now.getMonth();
    var nowYear = now.getFullYear();

    //从后台获取当前年月-打卡
    if (app.globalData.openid) {
      var openid = app.globalData.openid;
      var year = paramDate.getFullYear();
      var month = paramDate.getMonth();
      
      Server.getCalendarData(openid, year, month+1, res=>{
        //已签到日期
        var signDates = [];
        if (res.data.days){
          signDates = res.data.days;
        }
        //星期
        var days = ["日", "一", "二", "三", "四", "五", "六"];
        //签到日历
        var calendarObj = Calendar.getSignCalendar(paramDate, signDates);
        this.setData({
          signDates: signDates,
          year: paramDate.getFullYear(),
          month: paramDate.getMonth() + 1,
          calendarObj: calendarObj,
          days: days
        });

      });
    }
  },

  //上个月
  preMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month - 2;//月是从0开始的
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  //下个月
  nextMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month;
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  /**
   * 点击月数据
   */
  monthdata: function(){
    this.setData({
      monthCur:'cur-navigate-item',
      totalCur:'',
      showTotal:false
    });
  },

  /**
   * 点击总数据
   */
  totaldata: function () {
    this.setData({
      totalCur: 'cur-navigate-item',
      monthCur: '',
      showTotal: true
    });
  },
  
  /**
   * 编辑数据
   */
  useredit: function(){
    wx.navigateTo({
      url: '/pages/useredit/useredit'
    })
  },

  /**
   * 点击补签
   */
  handleReSign: function(){
    wx.navigateTo({
      url: '/pages/resign/resign'
    });
  },
  
  /**
   * 朋友圈分享
   */
  doshare: function(){
    this.setData({
      showModalStatus:true
    }); 
    this.drawShareImg();
  },

  //重新转换用户数据
  convertUserKms: function () {
    var globalUserInfo = app.globalData.globalUserInfo;
    var steps = parseInt(globalUserInfo.steps);
    var kms = parseFloat(globalUserInfo.kms);
    var caloris = parseFloat(globalUserInfo.caloris);

    var totalSteps = steps;
    var totalKms = kms;
    var totalCaloris = caloris;
    if (totalSteps < 10000) {

    } else if (totalSteps >= 10000 && totalSteps < 10000000) {
      totalSteps = (totalSteps / 10000).toFixed(2);
      totalSteps += "万";
    } else {
      totalSteps = (totalSteps / 10000000).toFixed(2);
      totalSteps += "千万";
    }
    globalUserInfo.totalSteps = totalSteps;

    if (totalKms < 10000) {

    } else if (totalKms >= 10000 && totalKms < 10000000) {
      totalKms = (totalKms / 10000).toFixed(2);
      totalKms += "万";
    } else {
      totalKms = (totalKms / 10000000).toFixed(2);
      totalKms += "千万";
    }
    globalUserInfo.totalKms = totalKms;

    if (totalCaloris < 1000) {
      totalCaloris = totalCaloris .toFixed(2)
    } else if (totalCaloris >= 1000 && totalCaloris < 10000) {
      totalCaloris = (totalCaloris / 1000).toFixed(2);
      totalCaloris += "千";
    } else if (totalCaloris >= 10000 && totalCaloris < 10000000) {
      totalCaloris = (totalCaloris / 10000).toFixed(2);
      totalCaloris += "万";
    } else {
      totalCaloris = (totalCaloris / 10000000).toFixed(2);
      totalCaloris += "千万";
    }
    globalUserInfo.totalCaloris = totalCaloris;
    return globalUserInfo;
  },

  /**
   * 画图
   */
  drawShareImg: function(){
    wx.showLoading({
      title: '图片生成中...',
    });
    app.globalData.globalUserInfo.avatarLocal ='/images/avatar.jpg';
    this._drawShareImg();
  },

  //画图
  _drawShareImg: function(){
    this.setData({
      hiddenCanvas:false
    });
    var destWidth = 1308;
    var destHeight = 1800;
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage('../../images/drawerbg.png', 0, 0, destWidth, destHeight);
    
    //头像
    var userInfo = app.globalData.globalUserInfo;
    var avatar = userInfo.avatarLocal;
    var nickName = userInfo.nickname;
    
    wx.getImageInfo({
      src: avatar,
      success: res => {
        //昵称
        ctx.setFontSize(70);
        ctx.setFillStyle("#FFFFFF");
        ctx.textAlign = 'center';
        ctx.fillText(nickName, 650, 100);

        ctx.textAlign = 'start';
        //画头像
        var headImgSize = 125;
        var img = ctx.drawImage(res.path, 583, 238, headImgSize, headImgSize);
        ctx.setStrokeStyle('#FFFFFF');
        ctx.setLineWidth(5);
        ctx.setLineCap('round');
        var rad = headImgSize / 2 + 25;
        ctx.arc(645, 300, rad, 0, 2 * Math.PI);
        ctx.stroke();

        //月份
        var year = this.data.year;
        var month = this.data.month;
        ctx.setFontSize(55);
        ctx.setFillStyle("#FFFFFF");
        ctx.fillText(year+"年"+month+"月", 230, 615);
        ctx.textAlign = 'left';
        ctx.fillText("一万步打卡小程序", 810, 615);

        //日历
        var days = ["日", "一", "二", "三", "四", "五", "六"];
        ctx.setFontSize(60);
        for (var i = 0; i < days.length; i++) {
          if (i === 0 || i === days.length - 1) {
            ctx.setFillStyle("#ff7e38");
          } else {
            ctx.setFillStyle("#141414");
          }
          var day = days[i];
          ctx.fillText(day, 90 + i * 180, 750);
        }

        ctx.setFontSize(16);
        ctx.setFillStyle("#141414");
        var curCalendars = this.data.calendarObj.calendar;
        var j = 0;
        var height = 700;
        var signbgHeight = 605;
        for (var i = 0; i < curCalendars.length; i++) {
          var item = curCalendars[i];
          var date = item.date;
          if (i % 7 === 0) {
            height += 170;
            signbgHeight += 170;
            j = 0;
          }
          ctx.setFillStyle("#141414");
          ctx.setFontSize(60);
          ctx.fillText(date, 90 + j * 180, height);
          if (item.sign) {
            ctx.drawImage("../../images/signbg.png", 35 + j * 182, signbgHeight, 150, 140);
            ctx.setFillStyle("#ff7e38");
            ctx.setFontSize(50);
            ctx.fillText(item.steps, 60 + j * 180, signbgHeight + 170);
          }
          j += 1;
        }

        //图片显示
        var that = this;
        ctx.draw(true, res => {
          wx.canvasToTempFilePath({
            destWidth: destWidth,
            destHeight: destHeight,
            canvasId: 'shareCanvas',
            success: function (res) {
              that.setData({
                imagePath: res.tempFilePath,
              });
            },
          });
        });

      },
      complete: res =>{
        //图片生成完成
        wx.hideLoading();
      }
    })
    
  },

  /**
   * 保存图片
   */
  saveImg: function(){
    var filePath = this.data.imagePath;
    return wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: res => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          showModalStatus: false,
          hiddenCanvas: true
        });
      }
    });
  },

  /**
   * 保存图片
   */
  cancel: function () {
    this.setData({
      showModalStatus: false,
      hiddenCanvas: true
    });
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
    var globalUserInfo = this.convertUserKms();
    var nowDate = new Date();
    this.initCalendar(nowDate);
    this.setData({
      showModalStatus: false,
      hiddenCanvas: true,
      globalUserInfo: globalUserInfo
    });
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
    var imageUrl = app.RES_URL + "banner.png?t=" + app.REFRESH_V;
    return {
      title: "[有人@我]，好友邀请你每天10000步打卡",
      imageUrl: imageUrl,
      path: "/pages/index/index",
      success: res => {    

      }
    }
  }


})