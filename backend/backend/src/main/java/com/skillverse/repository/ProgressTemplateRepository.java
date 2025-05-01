package com.skillverse.backend.repository;

import com.skillverse.backend.model.ProgressTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressTemplateRepository extends MongoRepository<ProgressTemplate, String> {
    // Add custom queries here if needed
}
