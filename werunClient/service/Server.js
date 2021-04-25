
/**
 * 从服务器获取数据用 load 开头
 */
const app = getApp();

//获取步数数据
function encryptWeRunData(encryptedData, iv, code, cb) {
  wx.request({
    url: app.HTTP_SERVER + '/encryptWeRunData.htm',
    method: "POST",
    data: {
      serverAppId: app.SERVER_APP_ID,
      encryptedData: encryptedData,
      iv: iv,
      code: code
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      if (typeof cb === "function") {
        cb(res);
      }
    },
    fail: function (res) {
      console.log(res);
    },
    complete(){
      wx.hideLoading();//数据加载完成
    }
  });
}

//同步用户数据
function getCalendarData(openid, year, month, cb) {
  wx.showLoading({
    title: '数据加载中...',
  });
  
  wx.request({
    url: app.HTTP_SERVER + '/getCalendarData.htm',
    method: "POST",
    data: {
      serverAppId: app.SERVER_APP_ID,
      openid: openid,
      year: year,
      month: month
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      if (typeof cb === 'function') {
        cb(res);
      }
    },
    fail: function (res) {
      //console.log("uploadLocalCacheData failure");
    },
    complete() {
      wx.hideLoading();//数据加载完成
    }
  });
}

/**
 * 保存用户信息
 */
function saveUserInfo(openid, height, weight, cb){
  wx.request({
    url: app.HTTP_SERVER + '/updateUserinfo.htm',
    method: "POST",
    data: {
      serverAppId: app.SERVER_APP_ID,
      openid: openid,
      height: height,
      weight: weight
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      if (typeof cb === 'function') {
        cb(res);
      }
    },
    fail: function (res) {
      //console.log("uploadLocalCacheData failure");
    }
  });
}

/**
 * 获取补打数据
 */
function redoCalendarData(cb) {
  wx.login({
    success: res => {
      var code = res.code;//code
      wx.getWeRunData({
        success: res => {
          var iv = res.iv;
          var encryptedData = res.encryptedData;

          wx.showLoading({
            title: '数据加载中...',
          });
          wx.request({
            url: app.HTTP_SERVER + '/redoCalendarData.htm',
            method: "POST",
            data: {
              serverAppId: app.SERVER_APP_ID,
              code: code,
              iv: iv,
              encryptedData: encryptedData
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if (typeof cb === 'function') {
                cb(res);
              }
            },
            fail: function (res) {
              //console.log("uploadLocalCacheData failure");
            },
            complete() {
              wx.hideLoading();//数据加载完成
            }
          });
        }
      });
    }
  });
}


//export
module.exports = {
  encryptWeRunData: encryptWeRunData,
  getCalendarData: getCalendarData,
  saveUserInfo: saveUserInfo,
  redoCalendarData: redoCalendarData
}


