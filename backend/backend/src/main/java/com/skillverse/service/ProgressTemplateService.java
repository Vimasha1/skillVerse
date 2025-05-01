package com.skillverse.service;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.repository.ProgressTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgressTemplateService {

    @Autowired
    private ProgressTemplateRepository progressTemplateRepository;

    // Get all templates
    public List<ProgressTemplate> getAllTemplates() {
        return progressTemplateRepository.findAll();
    }

    // Get a template by ID
    public ProgressTemplate getTemplateById(String id) {
        return progressTemplateRepository.findById(id).orElse(null);  // Return null if not found
    }

    // Add a new template
    public ProgressTemplate addTemplate(String templateText) {
        ProgressTemplate newTemplate = new ProgressTemplate(templateText);
        return progressTemplateRepository.save(newTemplate);
    }

    // Update an existing template
    public ProgressTemplate updateTemplate(String id, String templateText) {
        ProgressTemplate existingTemplate = progressTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        existingTemplate.setTemplateText(templateText);
        return progressTemplateRepository.save(existingTemplate);
    }

    // Delete a template
    public boolean deleteTemplate(String id) {
        if (progressTemplateRepository.existsById(id)) {
            progressTemplateRepository.deleteById(id);
            return true;  // Return true if deletion is successful
        }
        return false;  // Return false if template is not found
    }
}
