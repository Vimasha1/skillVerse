package com.skillverse.repository;

import com.skillverse.model.LearningPlan;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findBySharedWithContaining(String username);
    List<LearningPlan> findBySkillType(String skillType);

}
