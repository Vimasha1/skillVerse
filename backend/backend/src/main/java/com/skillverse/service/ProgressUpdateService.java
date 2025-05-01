package com.skillverse.backend.service;

import com.skillverse.backend.model.ProgressUpdate;
import com.skillverse.backend.repository.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    // Create a new progress update
    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate) {
        return progressUpdateRepository.save(progressUpdate);
    }

    // Get all progress updates for a user
    public List<ProgressUpdate> getProgressUpdatesByUserId(String userId) {
        return progressUpdateRepository.findAll(); // You can filter by userId if needed
    }

    // Get all progress updates
    public List<ProgressUpdate> getAllProgressUpdates() {
        return progressUpdateRepository.findAll();
    }

    // Update an existing progress update
    public ProgressUpdate updateProgressUpdate(String id, ProgressUpdate progressUpdate) {
        Optional<ProgressUpdate> existingProgressUpdate = progressUpdateRepository.findById(id);
        if (existingProgressUpdate.isPresent()) {
            ProgressUpdate update = existingProgressUpdate.get();
            update.setUpdateText(progressUpdate.getUpdateText());  // Update fields as needed
            update.setUpdateType(progressUpdate.getUpdateType());
            update.setProgressDate(progressUpdate.getProgressDate());  // Set new date if necessary
            return progressUpdateRepository.save(update);
        }
        return null; // Return null if no progress update with the given id is found
    }

    // Delete a progress update
    public boolean deleteProgressUpdate(String id) {
        Optional<ProgressUpdate> progressUpdate = progressUpdateRepository.findById(id);
        if (progressUpdate.isPresent()) {
            progressUpdateRepository.deleteById(id);
            return true;
        }
        return false; // Return false if no progress update with the given id is found
    }
}
