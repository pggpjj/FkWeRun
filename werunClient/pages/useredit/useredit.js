// pages/useredit/useredit.js
var Server = require("../../service/Server.js");
var util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
    
    var globalUserInfo = app.globalData.globalUserInfo;
    if (globalUserInfo){
      this.setData({
        weight: globalUserInfo.weight,
        height: globalUserInfo.height
      });
    }
  },

  /**
   * 提交表单
   */
  formSubmit: function (e) {
    if (app.globalData.openid) {
      var height = e.detail.value["height"];
      var weight = e.detail.value["weight"];
      if (!util.isEmpty(height) && !util.isEmpty(weight)) {
        Server.saveUserInfo(app.globalData.openid, height, weight, res => {
          wx.showToast({
            title: '保存成功',
            mask: true
          });
          app.globalData.globalUserInfo.weight = parseInt(weight)
          app.globalData.globalUserInfo.height = parseInt(height)
        });
      } else {
        wx.showToast({
          title: '请正确填写信息',
          mask: true,
          image: '../../images/error.png'
        });
      }
    } 
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