package com.skillverse.backend.service;

import com.skillverse.backend.model.ProgressTemplate;
import com.skillverse.backend.repository.ProgressTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressTemplateService {

    @Autowired
    private ProgressTemplateRepository progressTemplateRepository;

    // Get all templates
    public List<ProgressTemplate> getAllTemplates() {
        return progressTemplateRepository.findAll();
    }

    // Add a new template
    public ProgressTemplate addTemplate(String templateText) {
        ProgressTemplate newTemplate = new ProgressTemplate(templateText);
        return progressTemplateRepository.save(newTemplate);
    }

    // Update an existing template
    public ProgressTemplate updateTemplate(String id, String templateText) {
        Optional<ProgressTemplate> existingTemplate = progressTemplateRepository.findById(id);
        if (existingTemplate.isPresent()) {
            ProgressTemplate template = existingTemplate.get();
            template.setTemplateText(templateText);  // Update the template text
            return progressTemplateRepository.save(template);
        }
        return null;  // Return null if template not found
    }

    // Delete a template
    public boolean deleteTemplate(String id) {
        Optional<ProgressTemplate> template = progressTemplateRepository.findById(id);
        if (template.isPresent()) {
            progressTemplateRepository.deleteById(id);
            return true;
        }
        return false;  // Return false if template not found
    }
}
