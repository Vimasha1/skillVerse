// src/main/java/com/skillverse/service/TemplateCategoryService.java
package com.skillverse.service;

import com.skillverse.model.TemplateCategory;
import com.skillverse.repository.TemplateCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateCategoryService {

    @Autowired
    private TemplateCategoryRepository repo;

    public List<TemplateCategory> getAllCategories() {
        return repo.findAll();
    }

    public TemplateCategory getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public TemplateCategory create(TemplateCategory cat) {
        return repo.save(cat);
    }

    public TemplateCategory update(String id, TemplateCategory cat) {
        return repo.findById(id)
            .map(existing -> {
                existing.setName(cat.getName());
                existing.setIcon(cat.getIcon());
                existing.setFields(cat.getFields());
                return repo.save(existing);
            })
            .orElse(null);
    }

    public boolean delete(String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
