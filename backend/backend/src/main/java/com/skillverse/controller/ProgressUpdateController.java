// src/main/java/com/skillverse/controller/ProgressUpdateController.java
package com.skillverse.controller;

import com.skillverse.model.ProgressUpdate;
import com.skillverse.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService service;

    /**
     * GET /api/progress-updates
     * Optional filters:
     *   ?userId=… or ?categoryId=…
     */
    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> list(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String categoryId) {
        return ResponseEntity.ok(service.getAll(userId, categoryId));
    }

    /** GET /api/progress-updates/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdate> getById(@PathVariable String id) {
        ProgressUpdate upd = service.getById(id);
        return (upd == null)
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(upd);
    }

    /** POST /api/progress-updates */
    @PostMapping
    public ResponseEntity<ProgressUpdate> create(@RequestBody ProgressUpdate payload) {
        ProgressUpdate created = service.create(payload);
        return ResponseEntity.status(201).body(created);
    }

    /** PUT /api/progress-updates/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdate> update(
            @PathVariable String id,
            @RequestBody ProgressUpdate payload) {
        ProgressUpdate updated = service.update(id, payload);
        return (updated == null)
            ? ResponseEntity.notFound().build()
            : ResponseEntity.ok(updated);
    }

    /** DELETE /api/progress-updates/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return service.delete(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
