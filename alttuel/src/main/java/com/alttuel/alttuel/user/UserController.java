package com.alttuel.alttuel.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.alttuel.alttuel.config.Token.JwtTokenProvider;

import io.lettuce.core.dynamic.annotation.Param;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping(path = "/login")
    public String login(@Param(value = "userid") String userid, @Param(value = "userpassword") String userpassword) {
        boolean existuser = userServiceImpl.existUser(userid, userpassword);

        if (existuser) {
            return jwtTokenProvider.createToken(userid, userpassword);
        } else {
            return "false";
        }

    }

    @PostMapping(path = "/logincookie")
    public String logincookie(@Param(value = "cookie") String cookie) {
        try {
            String userid = jwtTokenProvider.getUser(cookie);
            userServiceImpl.UserExist(userid);
            return jwtTokenProvider.createToken(userid, userServiceImpl.getPassword(userid));
        } catch (Exception e) {
            return "false";
        }

    }

    @PostMapping(path = "/new")
    public String createUser(@RequestBody UserVO user) {
        userServiceImpl.createUser(user);
        return jwtTokenProvider.createToken(user.getUserid(), user.getUserpassword());

    }
}
