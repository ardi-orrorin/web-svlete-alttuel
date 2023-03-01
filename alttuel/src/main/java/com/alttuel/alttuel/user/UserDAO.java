package com.alttuel.alttuel.user;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserDAO {

    Optional<UserVO> findUserByUsername(@Param("userid") String userid);

    boolean UserExist(@Param("userid") String userid);

    String getPassword(@Param("userid") String userid);

    void createUser(UserVO user);
}
