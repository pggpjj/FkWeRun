package com.app.daka.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.app.daka.dao.DataDao;
import com.app.daka.dao.UserinfoDao;
import com.app.daka.domain.Data;
import com.app.daka.domain.Userinfo;
import com.app.daka.service.IDataService;
import com.app.daka.vo.KmCaloris;
import com.app.util.CalendarUtil;
import com.app.util.DateUtil;
import com.app.wechat.process.vo.StepListOpenid;


@Service
public class DataServiceImpl implements IDataService {
	
	@Autowired
	private DataDao dataDao;
	
	@Autowired
	private UserinfoDao userinfoDao;
	
	//上传打卡数据
	@Override
	public void uploadDakaDaka(Userinfo userinfo, Integer step){
		KmCaloris kc = this.getKms(userinfo.getHeight(), userinfo.getWeight(), step);
		double caloris = kc.getCaloris();
		double kms = kc.getKms();
		
		Integer year = CalendarUtil.getYear();
		Integer month = CalendarUtil.getMonth();
		Integer kdate = CalendarUtil.getDate();
		
		if(StringUtils.isNotEmpty(userinfo.getOpenid())){
			Data entity = new Data();
			entity.setOpenid(userinfo.getOpenid());
			entity.setYear(year);
			entity.setMonth(month);
			entity.setKdate(kdate);
			
			Data dakaData = dataDao.getTodayData(entity);
			if(null == dakaData){//没有打卡过
				entity.setSteps(step);
				entity.setCaloris(caloris);
				entity.setKms(kms);
				dataDao.create(entity);
			}else{//打过卡
				//先减去上次打卡数据
				userinfo.setMonthsteps(userinfo.getMonthsteps() - dakaData.getSteps());
				userinfo.setSteps(userinfo.getSteps() - dakaData.getSteps());
				userinfo.setKms(userinfo.getKms() - dakaData.getKms());
				userinfo.setCaloris(userinfo.getCaloris() - dakaData.getCaloris());
				
				if(dakaData.getSteps() >= 10000){//上次是有效打卡
					userinfo.setMonthkeepcount(userinfo.getMonthkeepcount() - 1);
					userinfo.setKeepcount(userinfo.getKeepcount() - 1);
				}
				dakaData.setSteps(step);
				dakaData.setCaloris(caloris);
				dakaData.setKms(kms);
				dataDao.update(dakaData);
			}
			
			//更新用户数据
			userinfo.setTodaysteps(step);
			if(null == userinfo.getSteps()) {
				userinfo.setSteps(0);
			}
			userinfo.setSteps(userinfo.getSteps() + step);
			if(null == userinfo.getMonthsteps()) {
				userinfo.setMonthsteps(0);
			}
			userinfo.setMonthsteps(userinfo.getMonthsteps() + step);
			if(null == userinfo.getKms()) {
				userinfo.setKms(0d);
			}
			userinfo.setKms(userinfo.getKms() + kms);
			if(null == userinfo.getCaloris()) {
				userinfo.setCaloris(0d);
			}
			userinfo.setCaloris(userinfo.getCaloris() + caloris);
			
			//更新有效打卡次数
			if(step >= 10000){
				if(null == userinfo.getMonthkeepcount()) {
					userinfo.setMonthkeepcount(0);
				}
				userinfo.setMonthkeepcount(userinfo.getMonthkeepcount() + 1);
				if(null == userinfo.getKeepcount()) {
					userinfo.setKeepcount(0);
				}
				userinfo.setKeepcount(userinfo.getKeepcount() + 1);
			}
			userinfoDao.update(userinfo);
		}
	}
	
	@Override
	public KmCaloris getKms(Integer height, Integer weight, Integer step){
		KmCaloris kc = new KmCaloris();
		double stepWidth = height * 0.5/100; //步幅米
		double caloris = weight * (step/1000) * stepWidth * 0.8;
        double kms = stepWidth * step/1000; //公里
        kc.setCaloris(caloris);
        kc.setKms(kms);
        return kc;
	}
	
	//获取打卡数据
	@Override
	public	List<Data> getCalendarData(String openid, Integer year, Integer month){
		Data queryData = new Data();
		queryData.setOpenid(openid);
		queryData.setYear(year);
		queryData.setMonth(month);
		return dataDao.getCalendarData(queryData);
	}
	
	//补打卡
	@Override
	public	List<Data> resignCalendarData(Userinfo userinfo, StepListOpenid stepObj, Integer year, Integer month){
		List<Data> returnList = new ArrayList<Data>();
		
		String openid = stepObj.getOpenid();
		Data queryData = new Data();
		queryData.setOpenid(openid);
		queryData.setYear(year);
		queryData.setMonth(month);
		List<Data> list = dataDao.getCalendarData(queryData);
		List<Data> insertList = new ArrayList<Data>();
		
		JSONArray steplist = stepObj.getSteplist();
		for(Object item : steplist){
			JSONObject jsObj = (JSONObject)item;
			Long timestamp = jsObj.getLong("timestamp");
			Integer step = jsObj.getInteger("step");
			
			Date tdate = new Date(timestamp*1000);
			Integer tm = CalendarUtil.getMonth(tdate);
			Integer td = CalendarUtil.getDate(tdate);
			
			if(!month.equals(tm)){
				continue;
			}
			
			boolean insertFlag = true;
	        if(list.size() > 0){//当前月
	        	Data d = list.get(0);
	        	if(d.getKdate().equals(td)){
	        		returnList.add(list.remove(0));//删除，并加入到返回列表中
	        		insertFlag = false;
        		}
	        }
	        
	        //需要插入
	        if(insertFlag && step > 0){
	        	Data d = new Data();
	        	d.setOpenid(openid);
	        	d.setYear(year);
	        	d.setMonth(month);
	        	d.setKdate(td);
	        	d.setSteps(step);
	        	
	        	KmCaloris kc = this.getKms(userinfo.getHeight(), userinfo.getWeight(), step);
	    		double caloris = kc.getCaloris();
	    		double kms = kc.getKms();
	        	d.setKms(kms);
	        	d.setCaloris(caloris);
	        	insertList.add(d);
	        	
	        	//更新用户数据
				userinfo.setSteps(userinfo.getSteps() + step);
				userinfo.setMonthsteps(userinfo.getMonthsteps() + step);
				userinfo.setKms(userinfo.getKms() + kms);
				userinfo.setCaloris(userinfo.getCaloris() + caloris);
				
				//更新有效打卡次数
				if(step >= 10000){
					userinfo.setMonthkeepcount(userinfo.getMonthkeepcount() + 1);
					userinfo.setKeepcount(userinfo.getKeepcount() + 1);
				}
	        	returnList.add(d);
	        }
		}
		
		//批量插入
		if(CollectionUtils.isNotEmpty(insertList)){
			dataDao.insertBatch(insertList);
			userinfoDao.update(userinfo);
		}
		return returnList;
	}
	
	@Override
	public void create(Data entity){
		dataDao.create(entity);
	}

	@Override
	public void update(Data entity){
		dataDao.update(entity);
	}

	@Override
	public void delete(Data entity){
		dataDao.delete(entity);
	}
	
	
	public static void main(String[] args){
		long timestamp = 1531670400L;
		Date tdate = new Date(timestamp*1000);
		System.out.println(DateUtil.COMMON.getDateText(tdate));
	}
	
}
