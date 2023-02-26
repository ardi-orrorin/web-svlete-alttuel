package com.alttuel.alttuel.sitelist;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SitelistVO {

    @JsonProperty(value = "id")
    private String id;

    @JsonProperty(value = "name")
    private String name;

    @JsonProperty(value = "domain")
    private String domain;

    @JsonProperty(value = "boardpath")
    private String boardpath;

    @JsonProperty(value = "memo")
    private String memo;

    @JsonProperty(value = "createdate")
    private LocalDateTime createdate;
}
