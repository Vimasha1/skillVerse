// src/main/java/com/skillverse/service/ProgressTemplateService.java
package com.skillverse.service;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.repository.ProgressTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressTemplateService {

    @Autowired
    private ProgressTemplateRepository repository;

    /** List all templates, or only those in a given category */
    public List<ProgressTemplate> getAllTemplates() {
        return repository.findAll();
    }

    public List<ProgressTemplate> getTemplatesByCategoryId(String categoryId) {
        return repository.findByCategoryId(categoryId);
    }

    /** Fetch one by its id */
    public ProgressTemplate getTemplateById(String id) {
        return repository.findById(id).orElse(null);
    }

    /** Create a brand-new template */
    public ProgressTemplate addTemplate(ProgressTemplate template) {
        return repository.save(template);
    }

    /** Update both its categoryId & templateText */
    public ProgressTemplate updateTemplate(String id, ProgressTemplate updated) {
        ProgressTemplate existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        existing.setCategoryId(updated.getCategoryId());
        existing.setTemplateText(updated.getTemplateText());
        return repository.save(existing);
    }

    /** Delete */
    public boolean deleteTemplate(String id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
