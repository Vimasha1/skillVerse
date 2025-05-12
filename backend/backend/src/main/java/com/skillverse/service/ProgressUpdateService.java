package com.skillverse.service;

import com.skillverse.model.ProgressUpdate;
import com.skillverse.repository.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository repository;

    public List<ProgressUpdate> getAllUpdates() {
        return repository.findAll();
    }

    public ProgressUpdate getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<ProgressUpdate> getByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public List<ProgressUpdate> getByCategory(String category) {
        return repository.findByCategory(category);
    }

    public ProgressUpdate create(ProgressUpdate update) {
        return repository.save(update);
    }

    public ProgressUpdate update(String id, ProgressUpdate newUpdate) {
        Optional<ProgressUpdate> existing = repository.findById(id);
        if (existing.isPresent()) {
            ProgressUpdate existingUpdate = existing.get();

            existingUpdate.setUserId(newUpdate.getUserId());
            existingUpdate.setTemplateId(newUpdate.getTemplateId());
            existingUpdate.setCategory(newUpdate.getCategory());
            existingUpdate.setProgressDate(newUpdate.getProgressDate());
            existingUpdate.setTemplateText(newUpdate.getTemplateText());
            existingUpdate.setExtraFields(newUpdate.getExtraFields());
            existingUpdate.setFreeText(newUpdate.getFreeText());

            return repository.save(existingUpdate);
        }
        return null;
    }

    public boolean delete(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
