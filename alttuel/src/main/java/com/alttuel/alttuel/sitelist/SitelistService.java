package com.alttuel.alttuel.sitelist;

import java.util.List;

public interface SitelistService {
    List<SitelistVO> getSitelist(
            Integer size,
            Integer page);

    void newSite(SitelistVO sitelist);
}
