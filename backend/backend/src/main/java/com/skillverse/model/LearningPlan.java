package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Topics must not be empty")
    private String topics;

    @NotBlank(message = "Skill type is required")
    private String skillType;

    // ← changed from String to List<Resource>
    @Valid
    @NotEmpty(message = "At least one resource is required")
    private List<Resource> resources = new ArrayList<>();

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be a future date")
    private LocalDate deadline;

    private String createdBy;

    private List<String> sharedWith = new ArrayList<>();

    @CreatedDate
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime updatedAt;

    @Valid
    private List<Milestone> milestones = new ArrayList<>();

    @DecimalMin(value = "0.0", inclusive = true, message = "Progress cannot be less than 0.0")
    @DecimalMax(value = "1.0", inclusive = true, message = "Progress cannot be more than 1.0")
    private double progress = 0.0;

    @Valid
    private List<@Future LocalDateTime> reminders = new ArrayList<>();

    private List<String> collaborators = new ArrayList<>();

    @Pattern(regexp = "private|shared|public", message = "Visibility must be 'private', 'shared', or 'public'")
    private String visibility = "private";

    @Min(value = 0, message = "Likes cannot be negative")
    private int likes = 0;

    private List<String> tags = new ArrayList<>();

    @FutureOrPresent(message = "Completion date must be today or in the future")
    private LocalDate completionDate;

    private LocalDateTime lastReviewedAt;

    @Min(value = 1, message = "Priority must be at least 1")
    @Max(value = 5, message = "Priority must be at most 5")
    private int rankedPriority = 3;

    private List<String> feedback = new ArrayList<>();


    // ─── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopics() { return topics; }
    public void setTopics(String topics) { this.topics = topics; }

    public String getSkillType() { return skillType; }
    public void setSkillType(String skillType) { this.skillType = skillType; }

    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public List<String> getSharedWith() { return sharedWith; }
    public void setSharedWith(List<String> sharedWith) { this.sharedWith = sharedWith; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<Milestone> getMilestones() { return milestones; }
    public void setMilestones(List<Milestone> milestones) { this.milestones = milestones; }

    public double getProgress() { return progress; }
    public void setProgress(double progress) { this.progress = progress; }

    public List<LocalDateTime> getReminders() { return reminders; }
    public void setReminders(List<LocalDateTime> reminders) { this.reminders = reminders; }

    public List<String> getCollaborators() { return collaborators; }
    public void setCollaborators(List<String> collaborators) { this.collaborators = collaborators; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }

    public LocalDateTime getLastReviewedAt() { return lastReviewedAt; }
    public void setLastReviewedAt(LocalDateTime lastReviewedAt) { this.lastReviewedAt = lastReviewedAt; }

    public int getRankedPriority() { return rankedPriority; }
    public void setRankedPriority(int rankedPriority) { this.rankedPriority = rankedPriority; }

    public List<String> getFeedback() { return feedback; }
    public void setFeedback(List<String> feedback) { this.feedback = feedback; }


    // ─── Progress Calculator ───────────────────────────────────────────────────

    /**
     * Recalculates progress based on completed vs total milestones.
     */
    public void recalcProgress() {
        if (milestones == null || milestones.isEmpty()) {
            this.progress = 0.0;
        } else {
            long done = milestones.stream()
                                  .filter(Milestone::isCompleted)
                                  .count();
            this.progress = (double) done / milestones.size();
        }
    }


    // ─── Inner Classes ─────────────────────────────────────────────────────────

    public static class Resource {
        public enum Type { VIDEO, WEBSITE, PDF }

        @NotNull(message = "Resource type is required")
        private Type type;

        @NotBlank(message = "URL is required")
        @Pattern(regexp = "https?://.*", message = "Must be a valid URL")
        private String url;

        public Resource() { }

        public Resource(Type type, String url) {
            this.type = type;
            this.url = url;
        }

        public Type getType() { return type; }
        public void setType(Type type) { this.type = type; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    public static class Milestone {
        @NotBlank(message = "Milestone name is required")
        private String name;

        @NotNull(message = "Milestone due date is required")
        @Future(message = "Milestone due date must be in the future")
        private LocalDate dueDate;

        private boolean completed;

        public Milestone() {}
        public Milestone(String name, LocalDate dueDate, boolean completed) {
            this.name = name;
            this.dueDate = dueDate;
            this.completed = completed;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

}
