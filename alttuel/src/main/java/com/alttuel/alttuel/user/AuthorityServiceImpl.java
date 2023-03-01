package com.alttuel.alttuel.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorityServiceImpl implements AuthorityService {

    @Autowired
    AuthorityDAO authorityDAO;

    public List<AuthorityVO> authList() {
        return authorityDAO.authList();
    }

}
