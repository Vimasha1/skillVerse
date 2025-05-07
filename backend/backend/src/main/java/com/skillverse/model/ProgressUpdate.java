// src/main/java/com/skillverse/model/ProgressUpdate.java
package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;
    private String categoryId;
    private String templateText;
    private LocalDateTime progressDate;

    /** user’s free-form notes */
    private String updateText;

    /**
     * Holds the values for whatever extra fields
     * TemplateCategory.fields defines for this category.
     * Key = FieldDefinition.name, Value = user input
     */
    private Map<String, Object> extraFields;

    public ProgressUpdate() {}

    public ProgressUpdate(String userId,
                          String categoryId,
                          String templateText,
                          LocalDateTime progressDate,
                          String updateText,
                          Map<String, Object> extraFields) {
        this.userId       = userId;
        this.categoryId   = categoryId;
        this.templateText = templateText;
        this.progressDate = progressDate;
        this.updateText   = updateText;
        this.extraFields  = extraFields;
    }

    public String getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getTemplateText() { return templateText; }
    public void setTemplateText(String templateText) { this.templateText = templateText; }

    public LocalDateTime getProgressDate() { return progressDate; }
    public void setProgressDate(LocalDateTime progressDate) { this.progressDate = progressDate; }

    public String getUpdateText() { return updateText; }
    public void setUpdateText(String updateText) { this.updateText = updateText; }

    public Map<String, Object> getExtraFields() { return extraFields; }
    public void setExtraFields(Map<String, Object> extraFields) { this.extraFields = extraFields; }
}
