// src/main/java/com/skillverse/service/ProgressTemplateService.java
package com.skillverse.service;

import com.skillverse.model.ProgressTemplate;
import com.skillverse.repository.ProgressTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgressTemplateService {

  @Autowired
  private ProgressTemplateRepository repo;

  public List<ProgressTemplate> getAllTemplates() {
    return repo.findAll();
  }

  public List<ProgressTemplate> getTemplatesByCategoryId(String categoryId) {
    return repo.findByCategoryId(categoryId);
  }

  public ProgressTemplate getTemplateById(String id) {
    return repo.findById(id).orElse(null);
  }

  public ProgressTemplate addTemplate(ProgressTemplate tpl) {
    return repo.save(tpl);
  }

  public ProgressTemplate updateTemplate(String id, ProgressTemplate tpl) {
    ProgressTemplate existing = repo.findById(id)
      .orElseThrow(() -> new RuntimeException("Template not found"));
    existing.setCategoryId(tpl.getCategoryId());
    existing.setTemplateText(tpl.getTemplateText());
    return repo.save(existing);
  }

  public boolean deleteTemplate(String id) {
    if (!repo.existsById(id)) return false;
    repo.deleteById(id);
    return true;
  }
}
