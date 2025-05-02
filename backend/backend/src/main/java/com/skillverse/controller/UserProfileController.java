package com.skillverse.controller;  // Corrected package declaration

import com.skillverse.model.UserProfile;
import com.skillverse.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // Get all user profiles
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUserProfiles() {
        List<UserProfile> userProfiles = userProfileService.getAllUserProfiles();
        return ResponseEntity.ok(userProfiles);
    }

    // Get a user profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable String id) {
        UserProfile userProfile = userProfileService.getUserProfileById(id);
        if (userProfile == null) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
        return ResponseEntity.ok(userProfile); // Return 200 OK with the user profile
    }

    // Create a new user profile
    @PostMapping("/create")
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile createdProfile = userProfileService.createUserProfile(userProfile);
        return ResponseEntity.status(201).body(createdProfile); // Return 201 Created
    }

    // Update an existing user profile
    @PutMapping("/update/{id}")
    public ResponseEntity<UserProfile> updateUserProfile(@PathVariable String id, @RequestBody UserProfile userProfile) {
        UserProfile updatedProfile = userProfileService.updateUserProfile(id, userProfile);
        if (updatedProfile == null) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
        return ResponseEntity.ok(updatedProfile); // Return 200 OK with the updated profile
    }

    // Delete a user profile by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable String id) {
        boolean deleted = userProfileService.deleteUserProfile(id);
        if (!deleted) {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
        return ResponseEntity.noContent().build(); // Return 204 No Content if deleted successfully
    }
}
