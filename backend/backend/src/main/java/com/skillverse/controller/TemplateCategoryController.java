// src/main/java/com/skillverse/controller/TemplateCategoryController.java
package com.skillverse.controller;

import com.skillverse.model.TemplateCategory;
import com.skillverse.service.TemplateCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/template-categories")
@CrossOrigin(origins = "http://localhost:3000")
public class TemplateCategoryController {

    @Autowired
    private TemplateCategoryService service;

    @GetMapping
    public ResponseEntity<List<TemplateCategory>> getAll() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateCategory> getById(@PathVariable String id) {
        TemplateCategory cat = service.getById(id);
        return cat == null
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(cat);
    }

    @PostMapping
    public ResponseEntity<TemplateCategory> create(@RequestBody TemplateCategory cat) {
        TemplateCategory created = service.create(cat);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateCategory> update(
            @PathVariable String id,
            @RequestBody TemplateCategory cat) {
        TemplateCategory updated = service.update(id, cat);
        return updated == null
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean ok = service.delete(id);
        return ok
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
