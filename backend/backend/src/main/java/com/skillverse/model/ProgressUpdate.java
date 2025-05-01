package com.skillverse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;
    private String updateText; // The text of the progress update (either template or custom)
    private LocalDateTime progressDate;
    private String updateType; // E.g., "Skill Progress"
    private String category; // E.g., "Development", "Learning", etc.
    private String templateId; // If using a template, store the template ID

    // Constructors
    public ProgressUpdate() {}

    public ProgressUpdate(String userId, String updateText, String updateType, String category, String templateId) {
        this.userId = userId;
        this.updateText = updateText;
        this.progressDate = LocalDateTime.now();
        this.updateType = updateType;
        this.category = category;
        this.templateId = templateId;
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

    public String getUpdateText() {
        return updateText;
    }

    public void setUpdateText(String updateText) {
        this.updateText = updateText;
    }

    public LocalDateTime getProgressDate() {
        return progressDate;
    }

    public void setProgressDate(LocalDateTime progressDate) {
        this.progressDate = progressDate;
    }

    public String getUpdateType() {
        return updateType;
    }

    public void setUpdateType(String updateType) {
        this.updateType = updateType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }
}
