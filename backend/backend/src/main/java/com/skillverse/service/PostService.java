package com.skillverse.service;

import com.skillverse.model.Comment;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
import com.skillverse.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    public Post createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        if (post.getLikes() == null) post.setLikes(new ArrayList<>());
        if (post.getComments() == null) post.setComments(new ArrayList<>());
        return postRepository.save(post);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Update a post
    public Optional<Post> updatePost(String id, Post updatedPost) {
        return postRepository.findById(id).map(existingPost -> {
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setMediaUrls(updatedPost.getMediaUrls());
            existingPost.setSkillName(updatedPost.getSkillName());
            existingPost.setUpdatedAt(new Date());
            return postRepository.save(existingPost);
        });
    }

    // Delete a post
    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Like or Unlike a post
    public Post toggleLike(String postId, String userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        List<String> likes = post.getLikes();

        if (likes.contains(userId)) {
            likes.remove(userId);
        } else {
            likes.add(userId);
        }

        post.setLikes(likes);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    // Add a comment to a post
    public Post addComment(String postId, Comment comment) {
        Post post = postRepository.findById(postId).orElseThrow();
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(new Date());
        comment.setReplies(new ArrayList<>());

        post.getComments().add(comment);
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    // Edit a comment
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

    // Delete a comment
    public Post deleteComment(String postId, String commentId) {
        Post post = postRepository.findById(postId).orElseThrow();
        post.getComments().removeIf(comment -> comment.getId().equals(commentId));
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    // Add a reply to a comment
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
}
