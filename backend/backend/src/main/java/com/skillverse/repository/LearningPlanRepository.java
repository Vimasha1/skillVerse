package com.skillverse.repository;

import com.skillverse.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findBySharedWithContaining(String username);
    List<LearningPlan> findBySkillType(String skillType);

    List<LearningPlan> findByCreatedBy(String createdBy);
    
    // Optionally extend with new queries for interactive fields if needed later
    // e.g., List<LearningPlan> findByVisibility(String visibility);
}

