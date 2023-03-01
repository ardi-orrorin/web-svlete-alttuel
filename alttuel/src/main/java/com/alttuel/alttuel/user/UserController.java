package com.alttuel.alttuel.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.alttuel.alttuel.config.Token.JwtTokenProvider;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping(path = "/login")
    public String login(@Param(value = "userid") String userid, @Param(value = "userpassword") String userpassword,
            HttpServletResponse response) {
        boolean existuser = userServiceImpl.existUser(userid, userpassword);

        if (existuser) {

            Cookie cookie1 = new Cookie("cookie",
                    String.valueOf(jwtTokenProvider.createToken(userid, userpassword)));
            cookie1.setPath("/");
            cookie1.setDomain("localhost");
            cookie1.setHttpOnly(true);
            cookie1.setSecure(true);
            cookie1.setMaxAge(5 * 60 * 60);

            response.addCookie(cookie1);

            return "true1";
        } else {
            return "false1";
        }

    }

    @PostMapping(path = "/logincookie")
    public String logincookie(@CookieValue("cookie") String cookie, HttpServletResponse response) {
        try {
            String userid = jwtTokenProvider.getUser(cookie);
            userServiceImpl.UserExist(userid);

            Cookie cookie1 = new Cookie("cookie",
                    String.valueOf(jwtTokenProvider.createToken(userid, userServiceImpl.getPassword(userid))));
            cookie1.setPath("/");
            cookie1.setDomain("localhost");
            cookie1.setHttpOnly(true);
            cookie1.setSecure(true);
            cookie1.setMaxAge(5 * 60 * 60);

            response.addCookie(cookie1);

            return "true";

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
