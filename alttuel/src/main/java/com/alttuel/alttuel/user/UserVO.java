package com.alttuel.alttuel.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserVO {

    private Integer id;
    private String userid;
    private String userpassword;
    private String useremail;
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
