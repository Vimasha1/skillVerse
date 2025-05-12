// src/main/java/com/skillverse/model/TemplateCategory.java
package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "template_categories")
public class TemplateCategory {

    @Id
    private String id;

    /** e.g. "Course Completed", "Project Milestone" */
    private String name;

    /** e.g. "🎓", "🚀", "🛠️" */
    private String icon;

    /** defines the extra fields required when using this category */
    private List<TemplateField> fields;

    public TemplateCategory() {}

    public TemplateCategory(String name,
                            String icon,
                            List<TemplateField> fields) {
        this.name   = name;
        this.icon   = icon;
        this.fields = fields;
    }

    public String getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public List<TemplateField> getFields() { return fields; }
    public void setFields(List<TemplateField> fields) { this.fields = fields; }
}
