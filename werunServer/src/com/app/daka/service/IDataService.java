package com.app.daka.service;

import java.util.List;

import com.app.daka.domain.Data;
import com.app.daka.domain.Userinfo;
import com.app.daka.vo.KmCaloris;
import com.app.wechat.process.vo.StepListOpenid;

public interface IDataService {
	
	//上传打卡数据
	void uploadDakaDaka(Userinfo userinfo, Integer step);
	
	KmCaloris getKms(Integer height, Integer weight, Integer step);
	
	//获取打卡数据
	List<Data> getCalendarData(String openid, Integer year, Integer month);
	
	//补打卡数据
	List<Data> resignCalendarData(Userinfo userinfo,StepListOpenid stepObj, Integer year, Integer month);
	
	void create(Data entity);

	void update(Data entity);

	void delete(Data entity);

}
