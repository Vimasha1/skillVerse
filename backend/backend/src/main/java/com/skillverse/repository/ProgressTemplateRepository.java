package com.skillverse.repository;

import com.skillverse.model.ProgressTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressTemplateRepository extends MongoRepository<ProgressTemplate, String> {
    // Add custom queries here if needed
}
