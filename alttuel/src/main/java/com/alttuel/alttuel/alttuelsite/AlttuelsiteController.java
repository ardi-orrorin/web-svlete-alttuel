package com.alttuel.alttuel.alttuelsite;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/alttuel")

public class AlttuelsiteController {

    @Autowired
    AlttuelsiteServiceImpl alttuelsiteServiceImpl;

    @GetMapping(path = "/list")
    public List<AlttuelsiteVO> getAlttuelList(
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "page") Integer page) {

        List<AlttuelsiteVO> AlttuelList = alttuelsiteServiceImpl.getAlttuelList(size, page);
        return AlttuelList;
    }
}
