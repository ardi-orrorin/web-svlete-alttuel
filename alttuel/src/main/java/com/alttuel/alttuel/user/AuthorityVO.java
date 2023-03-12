package com.alttuel.alttuel.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthorityVO {
    private Integer id;
    private String name;
    private Integer grade;
}
