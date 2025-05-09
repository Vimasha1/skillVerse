// src/main/java/com/skillverse/model/ProgressTemplate.java
package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progress_templates")
public class ProgressTemplate {

    @Id
    private String id;

    /** the category this template belongs to */
    private String categoryId;

    /** e.g. "I’ve completed {{courseName}} at {{institute}}!" */
    private String templateText;

    public ProgressTemplate() {}

    public ProgressTemplate(String categoryId, String templateText) {
        this.categoryId   = categoryId;
        this.templateText = templateText;
    }

    public String getId() {
        return id;
    }

    public String getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getTemplateText() {
        return templateText;
    }
    public void setTemplateText(String templateText) {
        this.templateText = templateText;
    }
}
