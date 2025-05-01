package com.skillverse.backend.controller;

import com.skillverse.backend.model.ProgressUpdate;
import com.skillverse.backend.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    // Get all progress updates
    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> getAllProgressUpdates() {
        List<ProgressUpdate> progressUpdates = progressUpdateService.getAllProgressUpdates();
        return ResponseEntity.ok(progressUpdates);
    }

    // Get progress updates by userId
    @GetMapping("/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdate> progressUpdates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return ResponseEntity.ok(progressUpdates);
    }

    // Create a new progress update
    @PostMapping("/create")
    public ResponseEntity<ProgressUpdate> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate createdProgressUpdate = progressUpdateService.createProgressUpdate(progressUpdate);
        return ResponseEntity.status(201).body(createdProgressUpdate);
    }

    // Update an existing progress update
    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(@PathVariable String id, @RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate updatedProgressUpdate = progressUpdateService.updateProgressUpdate(id, progressUpdate);
        return ResponseEntity.ok(updatedProgressUpdate);
    }

    // Delete a progress update
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        progressUpdateService.deleteProgressUpdate(id);
        return ResponseEntity.noContent().build();
    }
}
