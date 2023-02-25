package com.alttuel.alttuel.alttuelsite;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlttuelsiteVO {

    private String sitename;
    private String sitedomain;
    private String siteboardpath;
    private String boardtitle;
    private String boarddetailpath;
    private String boardthumnail;
    private LocalDateTime createdate;

}
