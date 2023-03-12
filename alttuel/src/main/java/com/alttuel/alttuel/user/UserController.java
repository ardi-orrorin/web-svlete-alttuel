package com.alttuel.alttuel.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.alttuel.alttuel.config.Token.JwtTokenProvider;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.token-validity-in-seconds}")
    private Integer time;

    @PostMapping(path = "/login")
    public String login(@Param(value = "userid") String userid, @Param(value = "userpassword") String userpassword,
            HttpServletResponse response) {
        boolean existuser = userServiceImpl.existUser(userid, userpassword);

        if (existuser) {
            Cookie newcookie = userServiceImpl.getCookie("cookie",
                    String.valueOf(jwtTokenProvider.createToken(userid, userpassword)), 5 * 60 * 60);
            response.addCookie(newcookie);
            return "true";
        } else {
            return "false";
        }

    }

    @PostMapping(path = "/logincookie")
    public String logincookie(HttpServletRequest request, HttpServletResponse response) {
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("cookie")) {
                    String userid = jwtTokenProvider.getUser(cookie.getValue());
                    userServiceImpl.UserExist(userid);
                    Cookie newcookie = userServiceImpl.getCookie("cookie",
                            String.valueOf(
                                    jwtTokenProvider
                                            .createToken(
                                                    userid,
                                                    userServiceImpl.getPassword(userid))),
                            time * 60);
                    response.addCookie(newcookie);
                    return "true";
                }
            }
            return "false";
        } catch (Exception e) {
            return "false";
        }
    }

    @PostMapping(path = "/new")
    public String createUser(@RequestBody UserVO user, HttpServletResponse response) {
        userServiceImpl.createUser(user);
        String token = jwtTokenProvider.createToken(user.getUserid(), user.getUserpassword());
        Cookie cookie = userServiceImpl.getCookie("cookie", token, time * 60);
        response.addCookie(cookie);
        return "true";
    }

    @PostMapping(path = "/logout")
    public void removecookie(@CookieValue("cookie") String cookie, HttpServletResponse response) {
        Cookie newcookie = userServiceImpl.removeCookie("cookie", null);
        response.addCookie(newcookie);

    }
}
