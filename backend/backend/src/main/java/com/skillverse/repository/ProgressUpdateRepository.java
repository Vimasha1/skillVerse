package com.skillverse.repository;

import com.skillverse.model.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);
    List<ProgressUpdate> findByCategory(String category);
}
