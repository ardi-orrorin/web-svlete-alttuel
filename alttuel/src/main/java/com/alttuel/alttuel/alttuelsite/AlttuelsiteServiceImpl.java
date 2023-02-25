package com.alttuel.alttuel.alttuelsite;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlttuelsiteServiceImpl implements AlttuelsiteService {

    @Autowired
    AlttuelsiteDAO alttuelsiteDAO;

    @Override
    public List<AlttuelsiteVO> getAlttuelList(
            Integer size,
            Integer page) {
        return alttuelsiteDAO.getAlttuelList(size, page);
    }
}
