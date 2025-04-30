package com.skillverse.service;

import com.skillverse.model.LearningPlan;
import com.skillverse.repository.LearningPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningPlanService {

    private final LearningPlanRepository repo;

    public LearningPlanService(LearningPlanRepository repo) {
        this.repo = repo;
    }

    public List<LearningPlan> getAllPlans() {
        return repo.findAll();
    }

    public LearningPlan getPlanById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repo.save(plan);
    }

    public LearningPlan updatePlan(Long id, LearningPlan updatedPlan) {
        LearningPlan existing = repo.findById(id).orElseThrow();
        existing.setTitle(updatedPlan.getTitle());
        existing.setTopics(updatedPlan.getTopics());
        existing.setResources(updatedPlan.getResources());
        existing.setDeadline(updatedPlan.getDeadline());
        return repo.save(existing);
    }

    public void deletePlan(Long id) {
        repo.deleteById(id);
    }
}
