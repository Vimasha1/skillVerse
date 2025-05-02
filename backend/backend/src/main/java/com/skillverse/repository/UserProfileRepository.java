package com.skillverse.repository;

import com.skillverse.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    // Custom query methods can be added here if needed
}

