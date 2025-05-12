// src/main/java/com/skillverse/repository/TemplateCategoryRepository.java
package com.skillverse.repository;

import com.skillverse.model.TemplateCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateCategoryRepository extends MongoRepository<TemplateCategory, String> {
    // you can add custom finder methods here if you like
}
