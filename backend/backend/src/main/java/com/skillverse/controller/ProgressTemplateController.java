package com.skillverse.controller;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.service.ProgressTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/progress-templates")
public class ProgressTemplateController {

    @Autowired
    private ProgressTemplateService service;

    @GetMapping
    public ResponseEntity<List<ProgressTemplate>> getAll() {
        return ResponseEntity.ok(service.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressTemplate> getById(@PathVariable String id) {
        ProgressTemplate template = service.getById(id);
        if (template == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(template);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProgressTemplate>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    @PostMapping("/create")
    public ResponseEntity<ProgressTemplate> create(@RequestBody ProgressTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(template));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressTemplate> update(@PathVariable String id, @RequestBody ProgressTemplate template) {
        ProgressTemplate updated = service.update(id, template);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.delete(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
