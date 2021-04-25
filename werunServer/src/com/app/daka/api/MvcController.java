package com.app.daka.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.app.AppConfig;
import com.app.daka.domain.Data;
import com.app.daka.domain.Userinfo;
import com.app.daka.service.IDataService;
import com.app.daka.service.IUserinfoService;
import com.app.daka.vo.KmCaloris;
import com.app.util.CalendarUtil;
import com.app.wechat.process.WeChatClient;
import com.app.wechat.process.vo.StepListOpenid;


/**
 * 用户打卡数据
 */
@Controller
@RequestMapping()
public class MvcController {
	
	@Autowired
	private IDataService dataService;
	
	@Autowired
	private IUserinfoService userinfoServiceImpl;
	
	/**
	 * 获取加密打卡数据
	 */
	@RequestMapping(value="/encryptWeRunData" , method=RequestMethod.POST)
	@ResponseBody
	public String encryptWeRunData(HttpServletRequest request,String encryptedData, String iv, String code, Integer mystep){
		
		StepListOpenid stepObj = WeChatClient.getStepListOpenid(AppConfig.DAKA.getAppId(),
				AppConfig.DAKA.getAppSecret(), encryptedData, iv, code);
		
		JSONObject jsobj = new JSONObject();
		if(null != stepObj && StringUtils.isNotEmpty(stepObj.getOpenid())){
			String openid = stepObj.getOpenid();
			jsobj.put("openid", openid);
			Integer step = stepObj.getTodayStep();
			jsobj.put("step",step);
			
			Integer nowMonth = CalendarUtil.getMonth();//当前月
			List<Data> stepList = new ArrayList<Data>();
			for(Object item : stepObj.getSteplist()){
				JSONObject tmpStepObj = (JSONObject)item;
				Long timestamp = tmpStepObj.getLong("timestamp");
				Date tdate = new Date(timestamp*1000);
				Integer tm = CalendarUtil.getMonth(tdate);
				Integer td = CalendarUtil.getDate(tdate);
				if(nowMonth == tm){
					Integer tmpStep = tmpStepObj.getInteger("step");
					Data data = new Data();
					data.setKdate(td);
					data.setSteps(tmpStep);
					
					KmCaloris kc = dataService.getKms(170, 60, tmpStep);
		    		double caloris = kc.getCaloris();
		    		double kms = kc.getKms();
		    		data.setKms(kms);
		    		data.setCaloris(caloris);
		        	
					stepList.add(data);
				}
				jsobj.put("stepList", stepList);
			}
			//获取当前微信用户
			Userinfo userinfo = userinfoServiceImpl.getOrCreate(openid);
			jsobj.put("userinfo", userinfo);
			
			//和上次打卡数据不一致，上传
			if(!step.equals(mystep)){
				dataService.uploadDakaDaka(userinfo, step);
			}
		}
		return jsobj.toString();
	}
	
	/**
	 * 获取打卡数据
	 */
	@RequestMapping(value="/getCalendarData" ,method=RequestMethod.POST)
	@ResponseBody
	public String getCalendarData(HttpServletRequest request, String openid, Integer year, Integer month){
		List<Data> list = dataService.getCalendarData(openid, year, month);
		JSONObject jsobj = new JSONObject();
		jsobj.put("days", list);
		return jsobj.toString();
	}
	
	/**
	 * 补打卡
	 */
	@RequestMapping(value="/redoCalendarData" , method=RequestMethod.POST)
	@ResponseBody
	public String redoCalendarData(HttpServletRequest request, String encryptedData, String iv, String code, Integer mystep){
		StepListOpenid stepObj = WeChatClient.getStepListOpenid(AppConfig.DAKA.getAppId(),
				AppConfig.DAKA.getAppSecret(), encryptedData, iv, code);
		
		JSONObject jsobj = new JSONObject();
		if(null != stepObj && StringUtils.isNotEmpty(stepObj.getOpenid())){
			String openid = stepObj.getOpenid();
			Userinfo userinfo = userinfoServiceImpl.getOrCreate(openid);
			
			Integer year = CalendarUtil.getYear();
			Integer month = CalendarUtil.getMonth();
			List<Data> list = dataService.resignCalendarData(userinfo,stepObj,year,month);
			
			JSONObject jsObj = new JSONObject();
			jsObj.put("userinfo", userinfo);
			jsObj.put("stepList", list);
			
			jsobj.put("data", jsObj);
		}
		
		return jsobj.toString();
	}
	
	/**
	 * 更新用户信息
	 */
	@RequestMapping(value="/updateUserinfo" , method=RequestMethod.POST)
	@ResponseBody
	public String updateUserinfo(HttpServletRequest request,Userinfo userinfo){
		userinfoServiceImpl.updateUserinfoByOpenid(userinfo);
		
		JSONObject jsobj = new JSONObject();
		jsobj.put("errcode", 0);
		return jsobj.toString();
	}
	
	/**
	 * 测试
	 */
	@RequestMapping(value="/test" , method=RequestMethod.GET)
	@ResponseBody
	public String test(HttpServletRequest request){
		JSONObject jsobj = new JSONObject();
		jsobj.put("errcode", 0);
		return jsobj.toString();
	}
	
}

