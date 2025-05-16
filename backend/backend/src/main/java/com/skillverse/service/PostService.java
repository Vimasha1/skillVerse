// src/main/java/com/skillverse/service/PostService.java

package com.skillverse.service;

import com.skillverse.model.Comment;
import com.skillverse.model.Notification;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
import com.skillverse.repository.NotificationRepository;
import com.skillverse.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ Save uploaded files and return created post
    public Post createPostWithFiles(Post post, MultipartFile[] files) {
        List<String> mediaUrls = new ArrayList<>();

        String uploadDir = System.getProperty("user.dir") + "/uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        File dest = new File(dir, fileName);
                        file.transferTo(dest);
                        mediaUrls.add("/uploads/" + fileName);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file", e);
                    }
                }
            }
        }

        post.setMediaUrls(mediaUrls);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        if (post.getLikes() == null)    post.setLikes(new ArrayList<>());
        if (post.getComments() == null) post.setComments(new ArrayList<>());

        return postRepository.save(post);
    }

    // ✅ Create post using JSON (no media files)
    public Post createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        if (post.getLikes() == null)    post.setLikes(new ArrayList<>());
        if (post.getComments() == null) post.setComments(new ArrayList<>());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // ✅ JSON‐only update
    public Optional<Post> updatePost(String id, Post updatedPost) {
        return postRepository.findById(id).map(existingPost -> {
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setMediaUrls(updatedPost.getMediaUrls());
            existingPost.setSkillName(updatedPost.getSkillName());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost);
        });
    }

    /**
     * ✅ Full multipart update, preserving client-kept URLs and uploading new files.
     */
    public Post updateWithFiles(
        String postId,
        Post updatedPost,
        MultipartFile[] newFiles
    ) throws IOException {
        Post existing = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        // — Text fields
        existing.setSkillName(updatedPost.getSkillName());
        existing.setDescription(updatedPost.getDescription());
        existing.setUpdatedAt(new Date());

        // — Keep only the URLs client passed along
        List<String> kept = updatedPost.getMediaUrls() != null
            ? updatedPost.getMediaUrls()
            : List.of();
        existing.setMediaUrls(new ArrayList<>(kept));

        // — Save new uploads
        String uploadDir = System.getProperty("user.dir") + "/uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        if (newFiles != null) {
            for (MultipartFile f : newFiles) {
                if (!f.isEmpty()) {
                    String filename = UUID.randomUUID() + "_" + f.getOriginalFilename();
                    File dest = new File(dir, filename);
                    f.transferTo(dest);
                    existing.getMediaUrls().add("/uploads/" + filename);
                }
            }
        }

        return postRepository.save(existing);
    }

    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Toggle like for a post, and notify the post owner if somebody else liked it.
     */
    public Post toggleLike(String postId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        List<String> likes = post.getLikes();
        boolean nowLiked;
        if (likes.contains(userId)) {
            likes.remove(userId);
            nowLiked = false;
        } else {
            likes.add(userId);
            nowLiked = true;
        }
        post.setLikes(likes);
        post.setUpdatedAt(new Date());
        Post saved = postRepository.save(post);

        // send notification only on like (not unlike), and only if liker != owner
        if (nowLiked && !userId.equals(post.getUserId())) {
            Notification n = new Notification();
            n.setRecipientUsername(post.getUserId());
            n.setActorUsername(userId);
            n.setType("LIKE");
            n.setPostId(postId);
            notificationRepository.save(n);
        }

        return saved;
    }

    /**
     * Add a comment, notify the post owner if commenter != owner.
     */
    public Post addComment(String postId, Comment comment) {
        Post post = postRepository.findById(postId).orElseThrow();
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setReplies(new ArrayList<>());
        post.getComments().add(comment);
        post.setUpdatedAt(new Date());
        Post saved = postRepository.save(post);

        // notify post owner if different
        if (!comment.getUserId().equals(post.getUserId())) {
            Notification n = new Notification();
            n.setRecipientUsername(post.getUserId());
            n.setActorUsername(comment.getUserId());
            n.setType("COMMENT");
            n.setPostId(postId);
            n.setCommentId(comment.getId());
            notificationRepository.save(n);
        }

        return saved;
    }

    /**
     * Edit a comment (only by its author).
     */
    public Post editComment(String postId, String commentId, String newText, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId) &&
                comment.getUserId().equals(userId)) {
                comment.setText(newText);
                comment.setUpdatedAt(new Date());
                break;
            }
        }
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    /**
     * Delete a comment (only by the author).
     */
    public Post deleteComment(String postId, String commentId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.getComments().removeIf(c ->
            c.getId().equals(commentId) && c.getUserId().equals(userId)
        );
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    /**
     * Add a reply, notify the comment owner if replier != comment owner.
     */
    public Post addReply(String postId, String commentId, Reply reply) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                reply.setId(UUID.randomUUID().toString());
                reply.setCreatedAt(new Date());
                comment.getReplies().add(reply);
                comment.setUpdatedAt(new Date());
                break;
            }
        }
        post.setUpdatedAt(new Date());
        Post saved = postRepository.save(post);

        // notify comment owner
        Optional<Comment> parent = saved.getComments().stream()
            .filter(c -> c.getId().equals(commentId))
            .findFirst();
        if (parent.isPresent() &&
            !reply.getUserId().equals(parent.get().getUserId())) {
            Notification n = new Notification();
            n.setRecipientUsername(parent.get().getUserId());
            n.setActorUsername(reply.getUserId());
            n.setType("REPLY");
            n.setPostId(postId);
            n.setCommentId(commentId);
            n.setReplyId(reply.getId());
            notificationRepository.save(n);
        }

        return saved;
    }

    /**
     * Edit a reply (only by its author).
     */
    public Post editReply(String postId, String commentId, String replyId, String newText, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                for (Reply reply : comment.getReplies()) {
                    if (reply.getId().equals(replyId) &&
                        reply.getUserId().equals(userId)) {
                        reply.setText(newText);
                        reply.setUpdatedAt(new Date());
                    }
                }
            }
        }
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    /**
     * Delete a reply (only by its author).
     */
    public Post deleteReply(String postId, String commentId, String replyId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                comment.getReplies().removeIf(r ->
                    r.getId().equals(replyId) && r.getUserId().equals(userId)
                );
            }
        }
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    /**
     * Optional: replace full comment list (used for syncing).
     */
    public Post replaceComments(String postId, List<Comment> comments) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.setComments(comments);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }
}
