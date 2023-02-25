package com.alttuel.alttuel.alttuelsite;

import java.util.List;

public interface AlttuelsiteService {
    List<AlttuelsiteVO> getAlttuelList(
            Integer size,
            Integer page);
}
