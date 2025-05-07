// src/main/java/com/skillverse/controller/ProgressTemplateController.java
package com.skillverse.controller;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.service.ProgressTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressTemplateController {

    @Autowired
    private ProgressTemplateService service;

    /** 
     * GET /api/progress-templates
     * Optionally filter by ?categoryId=…
     */
    @GetMapping
    public ResponseEntity<List<ProgressTemplate>> getAll(
            @RequestParam(required = false) String categoryId) {
        List<ProgressTemplate> list = (categoryId == null)
            ? service.getAllTemplates()
            : service.getTemplatesByCategoryId(categoryId);
        return ResponseEntity.ok(list);
    }

    /** GET /api/progress-templates/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ProgressTemplate> getById(@PathVariable String id) {
        ProgressTemplate tpl = service.getTemplateById(id);
        return (tpl == null)
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(tpl);
    }

    /** POST /api/progress-templates */
    @PostMapping
    public ResponseEntity<ProgressTemplate> create(@RequestBody ProgressTemplate template) {
        ProgressTemplate created = service.addTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** PUT /api/progress-templates/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ProgressTemplate> update(
            @PathVariable String id,
            @RequestBody ProgressTemplate template) {
        ProgressTemplate updated = service.updateTemplate(id, template);
        return (updated == null)
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(updated);
    }

    /** DELETE /api/progress-templates/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean ok = service.deleteTemplate(id);
        return ok
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
