package com.skillverse.controller;

import com.skillverse.model.LearningPlan;
import com.skillverse.service.LearningPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanService service;

    public LearningPlanController(LearningPlanService service) {
        this.service = service;
    }

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable String id) {
        LearningPlan plan = service.getPlanById(id);
        return plan != null ? ResponseEntity.ok(plan) : ResponseEntity.notFound().build();
    }

    @GetMapping("/shared/{username}")
    public List<LearningPlan> getPlansSharedWith(@PathVariable String username) {
    return service.getPlansSharedWith(username);
    }


    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan) {
        return ResponseEntity.status(201).body(service.createPlan(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        return ResponseEntity.ok(service.updatePlan(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        service.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
