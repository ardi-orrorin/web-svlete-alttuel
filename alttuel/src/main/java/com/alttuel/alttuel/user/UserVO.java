package com.alttuel.alttuel.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserVO {

    private Integer id;
    private String userid;
    private String userpassword;
    private String email;
    private Integer authority;

    /*
     * public String getuserid() {
     * return this.userid;
     * }
     * 
     * public String getuserpassword() {
     * return this.userpassword;
     * }
     */
}
