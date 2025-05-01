package com.skillverse.controller;

import com.skillverse.model.LearningPlan;
import com.skillverse.service.LearningPlanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
    public ResponseEntity<LearningPlan> createPlan(@Valid @RequestBody LearningPlan plan) {
        return ResponseEntity.status(201).body(service.createPlan(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable String id, @Valid @RequestBody LearningPlan plan) {
        return ResponseEntity.ok(service.updatePlan(id, plan));
    }

    //Error handler for validation failures
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .reduce("", (a, b) -> a + b + "\n");
        return ResponseEntity.badRequest().body(errorMsg.trim());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        service.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
