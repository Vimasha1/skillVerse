package com.skillverse.model;

import java.util.Date;
import java.util.List;

public class Comment {

    private String id;
    private String userId;
    private String text;
    private Date createdAt;
    private Date updatedAt; // ADD THIS
    private List<Reply> replies;

    public Comment() {}

    public Comment(String id, String userId, String text, Date createdAt, Date updatedAt, List<Reply> replies) {
        this.id = id;
        this.userId = userId;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.replies = replies;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }
}
