package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "progress_templates")
public class ProgressTemplate {

    @Id
    private String id;

    private String category; // e.g., "Skill Acquired", "Hackathon", etc.

    private String templateText; // e.g., "🔧 I’ve just mastered \"%skillName%\" at %proficiencyLevel%..."

    private List<DynamicField> fields; // List of field definitions

    // Inner class to describe a dynamic field
    public static class DynamicField {
        private String name;  // field key e.g., "skillName"
        private String type;  // string, date, number, etc.
        private String label; // User-friendly label like "Skill Name"

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTemplateText() { return templateText; }
    public void setTemplateText(String templateText) { this.templateText = templateText; }

    public List<DynamicField> getFields() { return fields; }
    public void setFields(List<DynamicField> fields) { this.fields = fields; }
}
