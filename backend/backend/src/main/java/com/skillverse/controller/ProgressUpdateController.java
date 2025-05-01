package com.skillverse.backend.controller;

import com.skillverse.backend.model.ProgressUpdate;
import com.skillverse.backend.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    // Get all progress updates for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdate> progressUpdates = progressUpdateService.getProgressUpdatesByUserId(userId);
        if (progressUpdates.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(progressUpdates);
        }
        return ResponseEntity.ok(progressUpdates);
    }

    // Add a new progress update
    @PostMapping("/create")
    public ResponseEntity<ProgressUpdate> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
        progressUpdate.setProgressDate(java.time.LocalDateTime.now());
        ProgressUpdate createdProgressUpdate = progressUpdateService.createProgressUpdate(progressUpdate);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProgressUpdate);
    }

    // Update an existing progress update
    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(@PathVariable String id, @RequestBody ProgressUpdate progressUpdate) {
        ProgressUpdate updatedProgressUpdate = progressUpdateService.updateProgressUpdate(id, progressUpdate);
        if (updatedProgressUpdate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // If no update is found for the provided id
        }
        return ResponseEntity.ok(updatedProgressUpdate);
    }

    // Delete a progress update
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        boolean isDeleted = progressUpdateService.deleteProgressUpdate(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();  // If deletion was successful
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // If no update was found for the provided id
        }
    }
}
