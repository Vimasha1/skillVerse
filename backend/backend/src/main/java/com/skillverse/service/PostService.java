package com.skillverse.service;

import com.skillverse.model.Comment;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
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

    // ✅ Save uploaded files and return created post
    public Post createPostWithFiles(Post post, MultipartFile[] files) {
        List<String> mediaUrls = new ArrayList<>();

        // ✅ Absolute path to avoid missing directory
        String uploadDir = System.getProperty("user.dir") + "/uploads";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            System.out.println("Created upload directory: " + uploadDir + " → " + created);
        }

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        File dest = new File(dir, fileName);
                        System.out.println("Uploading file to: " + dest.getAbsolutePath());
                        file.transferTo(dest);
                        mediaUrls.add("/uploads/" + fileName);
                    } catch (IOException e) {
                        System.err.println("Failed to upload file: " + file.getOriginalFilename());
                        e.printStackTrace();
                    }
                }
            }
        }

        post.setMediaUrls(mediaUrls);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        if (post.getLikes() == null) post.setLikes(new ArrayList<>());
        if (post.getComments() == null) post.setComments(new ArrayList<>());

        return postRepository.save(post);
    }

    // ✅ Create post using JSON (no media files)
    public Post createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        if (post.getLikes() == null) post.setLikes(new ArrayList<>());
        if (post.getComments() == null) post.setComments(new ArrayList<>());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> updatePost(String id, Post updatedPost) {
        return postRepository.findById(id).map(existingPost -> {
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setMediaUrls(updatedPost.getMediaUrls());
            existingPost.setSkillName(updatedPost.getSkillName());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost);
        });
    }

    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Post toggleLike(String postId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        List<String> likes = post.getLikes();
        if (likes.contains(userId)) likes.remove(userId);
        else likes.add(userId);
        post.setLikes(likes);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post addComment(String postId, Comment comment) {
        Post post = postRepository.findById(postId).orElseThrow();
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setReplies(new ArrayList<>());
        post.getComments().add(comment);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post editComment(String postId, String commentId, String newText) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                comment.setText(newText);
                comment.setUpdatedAt(new Date());
                break;
            }
        }
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post deleteComment(String postId, String commentId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.getComments().removeIf(comment -> comment.getId().equals(commentId));
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

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
        return postRepository.save(post);
    }

    public Post replaceComments(String postId, List<Comment> comments) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.setComments(comments);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post editComment(String postId, String commentId, String newText, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                if (!comment.getUserId().equals(userId)) {
                    throw new SecurityException("Unauthorized to edit this comment.");
                }
                comment.setText(newText);
                comment.setUpdatedAt(new Date());
                break;
            }
        }
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post deleteComment(String postId, String commentId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.getComments().removeIf(comment ->
            comment.getId().equals(commentId) && comment.getUserId().equals(userId)
        );
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }
    public Post editReply(String postId, String commentId, String replyId, String newText, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                for (Reply reply : comment.getReplies()) {
                    if (reply.getId().equals(replyId) && reply.getUserId().equals(userId)) {
                        reply.setText(newText);
                        reply.setUpdatedAt(new Date());
                    }
                }
            }
        }
        return postRepository.save(post);
    }
    public Post getPostById(String id) {
    return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
}
    
    public Post deleteReply(String postId, String commentId, String replyId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        for (Comment comment : post.getComments()) {
            if (comment.getId().equals(commentId)) {
                comment.getReplies().removeIf(reply ->
                    reply.getId().equals(replyId) && reply.getUserId().equals(userId)
                );
            }
        }
        return postRepository.save(post);
    }
        
    public List<Post> getPostsByUserId(String userId) {
    return postRepository.findByUserId(userId);
}


    
}
