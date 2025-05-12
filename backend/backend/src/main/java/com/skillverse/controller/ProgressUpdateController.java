package com.skillverse.controller;

import com.skillverse.model.ProgressUpdate;
import com.skillverse.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService service;

    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> getAll() {
        return ResponseEntity.ok(service.getAllUpdates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdate> getById(@PathVariable String id) {
        ProgressUpdate update = service.getById(id);
        if (update == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(update);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProgressUpdate>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    @PostMapping("/create")
    public ResponseEntity<ProgressUpdate> create(@RequestBody ProgressUpdate update) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(update));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressUpdate> update(@PathVariable String id, @RequestBody ProgressUpdate update) {
        ProgressUpdate updated = service.update(id, update);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.delete(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
