package com.alttuel.alttuel.user;

import jakarta.servlet.http.Cookie;
import java.util.Optional;

public interface UserService {
    Optional<UserVO> findUserByUsername(String userid);

    boolean UserExist(String userid);

    String getPassword(String userid);

    void createUser(UserVO user);

    Cookie getCookie(String key, String value, Integer time);
}
