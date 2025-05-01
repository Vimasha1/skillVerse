package com.skillverse.backend.repository;

import com.skillverse.backend.model.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);  // Custom query to find updates by userId
}
