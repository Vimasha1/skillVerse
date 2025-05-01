package com.skillverse.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "progress_updates")
public class ProgressUpdate {
    @Id
    private String id;
    private String userId;
    private String updateText;
    private LocalDateTime progressDate;
    private String updateType;

    // Constructors
    public ProgressUpdate() {}

    public ProgressUpdate(String userId, String updateText, LocalDateTime progressDate, String updateType) {
        this.userId = userId;
        this.updateText = updateText;
        this.progressDate = progressDate;
        this.updateType = updateType;
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
}
