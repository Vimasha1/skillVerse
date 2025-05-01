package com.skillverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progress_templates")
public class ProgressTemplate {

    @Id
    private String id;
    private String templateText;

    // Constructors
    public ProgressTemplate() {}

    public ProgressTemplate(String templateText) {
        this.templateText = templateText;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTemplateText() {
        return templateText;
    }

    public void setTemplateText(String templateText) {
        this.templateText = templateText;
    }
}
