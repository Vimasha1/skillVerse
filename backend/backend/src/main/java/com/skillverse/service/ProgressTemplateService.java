package com.skillverse.service;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.repository.ProgressTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressTemplateService {

    @Autowired
    private ProgressTemplateRepository repository;

    public List<ProgressTemplate> getAllTemplates() {
        return repository.findAll();
    }

    public ProgressTemplate getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<ProgressTemplate> getByCategory(String category) {
        return repository.findByCategory(category);
    }

    public ProgressTemplate create(ProgressTemplate template) {
        return repository.save(template);
    }

    public ProgressTemplate update(String id, ProgressTemplate newTemplate) {
        Optional<ProgressTemplate> existing = repository.findById(id);
        if (existing.isPresent()) {
            ProgressTemplate template = existing.get();
            template.setCategory(newTemplate.getCategory());
            template.setTemplateText(newTemplate.getTemplateText());
            template.setFields(newTemplate.getFields());
            return repository.save(template);
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
