// src/main/java/com/skillverse/controller/AuthController.java
package com.skillverse.controller;

import com.skillverse.model.UserProfile;
import com.skillverse.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        UserProfile user = authService.authenticate(req.username, req.password);
        if (user == null) {
            return ResponseEntity.status(401)
                                 .body(Map.of("message", "Invalid credentials"));
        }
        // In a real app you'd issue a JWT here. For now just return userId.
        return ResponseEntity.ok(Map.of("userId", user.getId()));
    }
}
