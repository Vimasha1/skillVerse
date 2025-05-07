package com.skillverse.repository;

import com.skillverse.model.ProgressTemplate;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressTemplateRepository extends MongoRepository<ProgressTemplate, String> {
    List<ProgressTemplate> findByCategoryId(String categoryId);
}
