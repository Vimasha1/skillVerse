package com.skillverse.controller;

import com.skillverse.model.UserProfile;
import com.skillverse.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    // GET all user profiles
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUserProfiles() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    // GET user profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable String id) {
        UserProfile profile = userProfileService.getUserProfileById(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    // GET user profile by username
    @GetMapping("/by-username/{username}")
    public ResponseEntity<UserProfile> getByUsername(@PathVariable String username) {
        UserProfile profile = userProfileService.getByUsername(username);
        if (profile == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(profile);
    }

    // CREATE user profile
    @PostMapping("/create")
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile created = userProfileService.createUserProfile(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE user profile
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

    // DELETE user profile
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable String id) {
        boolean deleted = userProfileService.deleteUserProfile(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // UPLOAD profile picture
    @PostMapping("/upload/{id}")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Ensure upload directory exists
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Save with unique name
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + filename;
            file.transferTo(new File(filePath));

            // Update profile picture path
            String relativePath = "/uploads/" + filename;
            userProfileService.updateProfilePicture(id, relativePath);

            return ResponseEntity.ok("File uploaded successfully");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file");
        }
    }

    // FOLLOW another user
    @PutMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<UserProfile> follow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.follow(userId, targetId));
    }

    // UNFOLLOW another user
    @PutMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<UserProfile> unfollow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.unfollow(userId, targetId));
    }
}
