package com.skillverse.service;

import com.skillverse.model.ProgressUpdate;
import com.skillverse.repository.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    // Get all progress updates
    public List<ProgressUpdate> getAllProgressUpdates() {
        return progressUpdateRepository.findAll();
    }

    // Create a new progress update
    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate) {
        return progressUpdateRepository.save(progressUpdate);
    }

    // Update an existing progress update
    public ProgressUpdate updateProgressUpdate(String id, ProgressUpdate progressUpdate) {
        ProgressUpdate existing = progressUpdateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Progress update not found"));
        existing.setUpdateText(progressUpdate.getUpdateText());
        existing.setUpdateType(progressUpdate.getUpdateType());
        existing.setCategory(progressUpdate.getCategory());
        return progressUpdateRepository.save(existing);
    }

    // Delete a progress update
    public void deleteProgressUpdate(String id) {
        progressUpdateRepository.deleteById(id);
    }

    // Get progress updates by userId
    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        return progressUpdateRepository.findByUserId(userId);
    }
}
