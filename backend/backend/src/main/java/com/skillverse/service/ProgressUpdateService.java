// src/main/java/com/skillverse/service/ProgressUpdateService.java
package com.skillverse.service;

import com.skillverse.model.ProgressUpdate;
import com.skillverse.repository.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository repository;

    /**
     * List updates, optionally filtered:
     * - by userId
     * - by categoryId
     * - or both
     */
    public List<ProgressUpdate> getAll(String userId, String categoryId) {
        if (userId != null && categoryId != null) {
            return repository.findByUserIdAndCategoryId(userId, categoryId);
        }
        if (userId != null) {
            return repository.findByUserId(userId);
        }
        if (categoryId != null) {
            return repository.findByCategoryId(categoryId);
        }
        return repository.findAll();
    }

    /** Fetch one by id */
    public ProgressUpdate getById(String id) {
        return repository.findById(id).orElse(null);
    }

    /** Create new, stamping the current date/time */
    public ProgressUpdate create(ProgressUpdate upd) {
        upd.setProgressDate(LocalDateTime.now());
        return repository.save(upd);
    }

    /** Update its text, prompt, and any extraFields */
    public ProgressUpdate update(String id, ProgressUpdate upd) {
        ProgressUpdate existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Progress update not found"));
        existing.setTemplateText(upd.getTemplateText());
        existing.setUpdateText(upd.getUpdateText());
        existing.setExtraFields(upd.getExtraFields());
        // you could also allow changing categoryId if desired
        return repository.save(existing);
    }

    /** Delete */
    public boolean delete(String id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
