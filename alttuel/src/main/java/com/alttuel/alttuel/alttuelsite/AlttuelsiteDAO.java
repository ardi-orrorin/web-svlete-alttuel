package com.alttuel.alttuel.alttuelsite;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AlttuelsiteDAO {
    List<AlttuelsiteVO> getAlttuelList(
            @Param("size") Integer size,
            @Param("page") Integer page);
}
