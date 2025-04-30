package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;


@Document(collection = "learning_plans") // collection name in MongoDB
public class LearningPlan {

    @Id
    private String id;

    private String title;
    private String topics;
    private String resources;
    private LocalDate deadline;
    private String createdBy;
    private List<String> sharedWith = new ArrayList<>();


    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopics() { return topics; }
    public void setTopics(String topics) { this.topics = topics; }

    public String getResources() { return resources; }
    public void setResources(String resources) { this.resources = resources; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public List<String> getSharedWith() {
        return sharedWith;
    }
    public void setSharedWith(List<String> sharedWith) {
        this.sharedWith = sharedWith;
    }
    
}
