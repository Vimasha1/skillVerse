package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Map;

@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;                  // Reference to UserProfile
    private String templateId;              // Optional, reference to ProgressTemplate
    private String category;                // E.g., Skill Acquired, Hackathon
    private LocalDate progressDate;         // Completion date

    private String templateText;            // Rendered template string
    private Map<String, Object> extraFields; // Dynamic fields per template
    private String freeText;                // Used when no template is selected

    // Constructors
    public ProgressUpdate() {}

    public ProgressUpdate(String userId, String templateId, String category, LocalDate progressDate,
                          String templateText, Map<String, Object> extraFields, String freeText) {
        this.userId = userId;
        this.templateId = templateId;
        this.category = category;
        this.progressDate = progressDate;
        this.templateText = templateText;
        this.extraFields = extraFields;
        this.freeText = freeText;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getProgressDate() {
        return progressDate;
    }

    public void setProgressDate(LocalDate progressDate) {
        this.progressDate = progressDate;
    }

    public String getTemplateText() {
        return templateText;
    }

    public void setTemplateText(String templateText) {
        this.templateText = templateText;
    }

    public Map<String, Object> getExtraFields() {
        return extraFields;
    }

    public void setExtraFields(Map<String, Object> extraFields) {
        this.extraFields = extraFields;
    }

    public String getFreeText() {
        return freeText;
    }

    public void setFreeText(String freeText) {
        this.freeText = freeText;
    }
}
