package com.skillverse.controller;

import com.skillverse.model.UserProfile;
import com.skillverse.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // GET /api/user-profiles
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUserProfiles() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    // GET /api/user-profiles/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable String id) {
        UserProfile profile = userProfileService.getUserProfileById(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    // POST /api/user-profiles/create
    @PostMapping("/create")
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile created = userProfileService.createUserProfile(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/user-profiles/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<UserProfile> updateUserProfile(
            @PathVariable String id,
            @RequestBody UserProfile userProfile) {

        UserProfile updated = userProfileService.updateUserProfile(id, userProfile);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/user-profiles/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable String id) {
        boolean deleted = userProfileService.deleteUserProfile(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<UserProfile> follow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.follow(userId, targetId));
    }

    @PutMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<UserProfile> unfollow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.unfollow(userId, targetId));
    }

    // GET /api/user-profiles/by-username/{username}
    @GetMapping("/by-username/{username}")
    public ResponseEntity<UserProfile> getByUsername(@PathVariable String username) {
        UserProfile profile = userProfileService.getByUsername(username);
        if (profile == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(profile);
    }   

}
