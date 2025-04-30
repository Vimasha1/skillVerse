package com.skillverse.repository;

import com.skillverse.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
}
