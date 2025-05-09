// src/main/java/com/skillverse/model/TemplateField.java
package com.skillverse.model;

public class TemplateField {
    private String key;
    private String label;
    private String type;       // e.g. "text", "date", "url"
    private boolean required;
    private String placeholder;

    public TemplateField() {}

    public TemplateField(String key, String label, String type, boolean required, String placeholder) {
        this.key         = key;
        this.label       = label;
        this.type        = type;
        this.required    = required;
        this.placeholder = placeholder;
    }

    public String getKey() {
        return key;
    }
    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public boolean isRequired() {
        return required;
    }
    public void setRequired(boolean required) {
        this.required = required;
    }

    public String getPlaceholder() {
        return placeholder;
    }
    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
    }
}
