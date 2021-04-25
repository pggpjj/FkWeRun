package com.app.daka.dao;

import java.util.List;

import com.app.daka.domain.Data;


public interface DataDao {
	
	public void create(Data entity);
	
	public void update(Data entity);
	
	public void delete(Data entity);
	
	public Data getTodayData(Data queryEntity);
	
	public List<Data> getCalendarData(Data queryEntity);
	
	public void insertBatch(List<Data> list);

}

