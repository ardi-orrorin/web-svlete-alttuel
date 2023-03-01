package com.alttuel.alttuel.user;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuthorityDAO {
    List<AuthorityVO> authList();

}
