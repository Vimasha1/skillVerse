// src/main/java/com/skillverse/repository/UserProfileRepository.java
package com.skillverse.repository;

import com.skillverse.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findByUsername(String username);
}
