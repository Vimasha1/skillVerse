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

    public LearningPlan getPlanById(String id) {
        return repo.findById(id).orElse(null);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        plan.recalcProgress();           // ← compute progress before insert
        return repo.save(plan);
    }

    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        LearningPlan existing = repo.findById(id)
                                    .orElseThrow(() -> new RuntimeException("Plan not found"));

        // ─── Core fields ────────────────────────────────────────────────
        existing.setTitle(updatedPlan.getTitle());
        existing.setTopics(updatedPlan.getTopics());
        existing.setResources(updatedPlan.getResources());
        existing.setDeadline(updatedPlan.getDeadline());
        existing.setSkillType(updatedPlan.getSkillType());
        existing.setCreatedBy(updatedPlan.getCreatedBy());
        existing.setSharedWith(updatedPlan.getSharedWith());

        // ─── Milestones & progress ───────────────────────────────────────
        existing.setMilestones(updatedPlan.getMilestones());
        existing.recalcProgress();       // ← compute progress on update

        // ─── Other interactive fields ───────────────────────────────────
        existing.setReminders(updatedPlan.getReminders());
        existing.setCollaborators(updatedPlan.getCollaborators());
        existing.setVisibility(updatedPlan.getVisibility());
        existing.setLikes(updatedPlan.getLikes());
        existing.setTags(updatedPlan.getTags());
        existing.setCompletionDate(updatedPlan.getCompletionDate());
        existing.setLastReviewedAt(updatedPlan.getLastReviewedAt());
        existing.setRankedPriority(updatedPlan.getRankedPriority());
        existing.setFeedback(updatedPlan.getFeedback());

        return repo.save(existing);
    }

    public void deletePlan(String id) {
        repo.deleteById(id);
    }

    public List<LearningPlan> getPlansSharedWith(String username) {
        return repo.findBySharedWithContaining(username);
    }

    public List<LearningPlan> getPlansBySkillType(String type) {
        return repo.findBySkillType(type);
    }
}
