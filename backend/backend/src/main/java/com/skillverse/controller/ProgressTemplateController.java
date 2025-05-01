package com.skillverse.backend.controller;

import com.skillverse.backend.model.ProgressTemplate;
import com.skillverse.backend.service.ProgressTemplateService;
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

    // Add a new template
    @PostMapping("/add")
    public ResponseEntity<ProgressTemplate> addTemplate(@RequestBody String templateText) {
        ProgressTemplate newTemplate = progressTemplateService.addTemplate(templateText);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTemplate);
    }

    // Update an existing template
    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressTemplate> updateTemplate(@PathVariable String id, @RequestBody String templateText) {
        ProgressTemplate updatedTemplate = progressTemplateService.updateTemplate(id, templateText);
        if (updatedTemplate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Return 404 if template not found
        }
        return ResponseEntity.ok(updatedTemplate);
    }

    // Delete a template
    @DeleteMapping("/delete/{id}")
