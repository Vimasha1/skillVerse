package com.skillverse.backend.repository;

import com.skillverse.backend.model.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    // Custom queries can be added here if needed
}
