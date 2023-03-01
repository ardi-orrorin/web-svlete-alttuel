package com.alttuel.alttuel.user;

import java.util.Optional;

public interface UserService {
    Optional<UserVO> findUserByUsername(String userid);

    boolean UserExist(String userid);

    String getPassword(String userid);

    void createUser(UserVO user);
}
