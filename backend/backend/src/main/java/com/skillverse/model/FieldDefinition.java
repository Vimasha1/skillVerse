// src/main/java/com/skillverse/model/FieldDefinition.java
package com.skillverse.model;

public class FieldDefinition {
    private String name;       // key, e.g. "institute"
    private String label;      // human label, e.g. "Institute Name"
    private String type;       // input type, e.g. "text", "date", "url"
    private boolean required;  // must the user supply this?

    public FieldDefinition() {}

    public FieldDefinition(String name, String label, String type, boolean required) {
        this.name     = name;
        this.label    = label;
        this.type     = type;
        this.required = required;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
}
