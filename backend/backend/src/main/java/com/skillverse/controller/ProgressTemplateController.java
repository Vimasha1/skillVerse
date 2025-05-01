package com.skillverse.controller;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.service.ProgressTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class ProgressTemplateController {

    @Autowired
    private ProgressTemplateService progressTemplateService;

    // Get all available templates
    @GetMapping
    public ResponseEntity<List<ProgressTemplate>> getTemplates() {
        List<ProgressTemplate> templates = progressTemplateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    // Get a single template by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProgressTemplate> getTemplateById(@PathVariable String id) {
        ProgressTemplate template = progressTemplateService.getTemplateById(id);
        if (template == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if not found
        }
        return ResponseEntity.ok(template); // Return 200 OK with template
    }

    // Add a new template
    @PostMapping("/add")
    public ResponseEntity<ProgressTemplate> addTemplate(@RequestBody String templateText) {
        ProgressTemplate newTemplate = progressTemplateService.addTemplate(templateText);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTemplate);
    }

    // Update an existing template by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressTemplate> updateTemplate(@PathVariable String id, @RequestBody String templateText) {
        ProgressTemplate updatedTemplate = progressTemplateService.updateTemplate(id, templateText);
        if (updatedTemplate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if template not found
        }
        return ResponseEntity.ok(updatedTemplate); // Return 200 OK with the updated template
    }

    // Delete a template by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        boolean deleted = progressTemplateService.deleteTemplate(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if template not found
        }
        return ResponseEntity.noContent().build(); // Return 204 No Content if deleted successfully
    }
}
