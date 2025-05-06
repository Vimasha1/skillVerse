// src/main/java/com/skillverse/service/AuthService.java
package com.skillverse.service;

import com.skillverse.model.UserProfile;
import com.skillverse.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserProfileRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Returns the user if username/password match, otherwise null.
     */
    public UserProfile authenticate(String username, String rawPassword) {
        return userRepo.findByUsername(username)
                       .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
                       .orElse(null);
    }
}
