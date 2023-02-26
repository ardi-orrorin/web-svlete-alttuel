package com.alttuel.alttuel.sitelist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/sitelist")
public class SitelistController {

    @Autowired
    private SitelistServiceImpl sitelistServiceImpl;

    @GetMapping(path = "/list")
    public List<SitelistVO> getSitelist(
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "page") Integer page) {
        List<SitelistVO> Sitelist = sitelistServiceImpl.getSitelist(size, page);
        return Sitelist;
    }

    @PostMapping(path = "/list/new")
    public void newSite(@RequestBody SitelistVO sitelist) {
        sitelistServiceImpl.newSite(sitelist);
    }
}
