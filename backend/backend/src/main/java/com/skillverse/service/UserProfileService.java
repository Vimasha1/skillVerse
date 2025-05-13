package com.skillverse.service;

import com.skillverse.model.UserProfile;
import com.skillverse.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all user profiles
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    // Get a user profile by ID
    public UserProfile getUserProfileById(String id) {
        return userProfileRepository.findById(id).orElse(null);
    }

    // Get a user profile by username
    public UserProfile getByUsername(String username) {
        return userProfileRepository.findByUsername(username).orElse(null);
    }

    // Create a new user profile
    public UserProfile createUserProfile(UserProfile userProfile) {
        String hashedPassword = passwordEncoder.encode(userProfile.getPassword());
        userProfile.setPassword(hashedPassword);
        return userProfileRepository.save(userProfile);
    }

    // Update an existing user profile
    public UserProfile updateUserProfile(String id, UserProfile userProfile) {
        Optional<UserProfile> existingUserProfile = userProfileRepository.findById(id);
        if (existingUserProfile.isPresent()) {
            UserProfile profile = existingUserProfile.get();
            profile.setFirstName(userProfile.getFirstName());
            profile.setLastName(userProfile.getLastName());
            profile.setEmail(userProfile.getEmail());
            profile.setPhone(userProfile.getPhone());
            profile.setAddress(userProfile.getAddress());
            profile.setEducation(userProfile.getEducation());
            profile.setJobPosition(userProfile.getJobPosition());
            profile.setCompany(userProfile.getCompany());
            if (userProfile.getPassword() != null && !userProfile.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(userProfile.getPassword());
                profile.setPassword(hashedPassword);
            }
            return userProfileRepository.save(profile);
        }
        return null;
    }

    // Update only profile picture
    public void updateProfilePicture(String id, String picturePath) {
        Optional<UserProfile> optional = userProfileRepository.findById(id);
        if (optional.isPresent()) {
            UserProfile profile = optional.get();
            profile.setProfilePicture(picturePath);
            userProfileRepository.save(profile);
        }
    }

    // Delete a user profile by ID
    public boolean deleteUserProfile(String id) {
        if (userProfileRepository.existsById(id)) {
            userProfileRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Follow another user
    public UserProfile follow(String userId, String targetId) {
        UserProfile me = userProfileRepository.findById(userId).orElseThrow();
        UserProfile target = userProfileRepository.findById(targetId).orElseThrow();
        me.getFollowing().add(targetId);
        target.getFollowers().add(userId);
        userProfileRepository.save(target);
        return userProfileRepository.save(me);
    }

    // Unfollow a user
    public UserProfile unfollow(String userId, String targetId) {
        UserProfile me = userProfileRepository.findById(userId).orElseThrow();
        UserProfile target = userProfileRepository.findById(targetId).orElseThrow();
        me.getFollowing().remove(targetId);
        target.getFollowers().remove(userId);
        userProfileRepository.save(target);
        return userProfileRepository.save(me);
    }

    // General save
    public UserProfile save(UserProfile profile) {
        return userProfileRepository.save(profile);
    }
}
