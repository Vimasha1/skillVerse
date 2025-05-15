// src/main/java/com/skillverse/controller/UserProfileController.java
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

    // GET /api/user-profiles/by-username/{username}
    @GetMapping("/by-username/{username}")
    public ResponseEntity<UserProfile> getByUsername(@PathVariable String username) {
        UserProfile profile = userProfileService.getByUsername(username);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    // NEW: GET /api/user-profiles/search?q=foo
    @GetMapping("/search")
    public ResponseEntity<List<UserProfile>> searchUsers(@RequestParam("q") String query) {
        // optional: require at least 2 chars
        if (query == null || query.trim().length() < 1) {
            return ResponseEntity.ok(List.of());
        }
        List<UserProfile> matches = userProfileService.searchByUsername(query.trim());
        return ResponseEntity.ok(matches);
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

    // POST /api/user-profiles/upload/{id}
    @PostMapping("/upload/{id}")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + filename;
            file.transferTo(new File(filePath));

            String relativePath = "/uploads/" + filename;
            userProfileService.updateProfilePicture(id, relativePath);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Could not upload file");
        }
    }

    // PUT /api/user-profiles/{userId}/follow/{targetId}
    @PutMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<UserProfile> follow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.follow(userId, targetId));
    }

    // PUT /api/user-profiles/{userId}/unfollow/{targetId}
    @PutMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<UserProfile> unfollow(
            @PathVariable String userId,
            @PathVariable String targetId) {
        return ResponseEntity.ok(userProfileService.unfollow(userId, targetId));
    }
}
