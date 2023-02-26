package com.alttuel.alttuel.sitelist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SitelistServiceImpl implements SitelistService {

    @Autowired
    SitelistDAO sitelistDAO;

    @Override
    public List<SitelistVO> getSitelist(
            Integer size,
            Integer page) {
        return sitelistDAO.getSitelist(size, page);
    }

    @Override
    public void newSite(SitelistVO sitelist) {
        sitelistDAO.newSite(sitelist);
    }
}
