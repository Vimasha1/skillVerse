package com.skillverse.repository;

import com.skillverse.model.ProgressTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressTemplateRepository extends MongoRepository<ProgressTemplate, String> {
    List<ProgressTemplate> findByCategory(String category);
}
