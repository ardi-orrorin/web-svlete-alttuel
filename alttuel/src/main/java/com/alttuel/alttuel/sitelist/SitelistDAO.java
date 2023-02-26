package com.alttuel.alttuel.sitelist;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SitelistDAO {
    List<SitelistVO> getSitelist(
            @Param("size") Integer size,
            @Param("page") Integer page);
}
