package com.skillverse.controller;

import com.skillverse.model.Comment;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
import com.skillverse.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Allow requests from frontend
public class PostController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // Update a post
    @PutMapping("/{id}")
    public Optional<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        return postService.updatePost(id, updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        return deleted ? "Post deleted successfully." : "Post not found.";
    }

    // Toggle like on post
    @PostMapping("/{postId}/like")
    public Post toggleLike(@PathVariable String postId, @RequestParam String userId) {
        return postService.toggleLike(postId, userId);
    }

    // Add comment
    @PostMapping("/{postId}/comments")
    public Post addComment(@PathVariable String postId, @RequestBody Comment comment) {
        return postService.addComment(postId, comment);
    }

    // Edit comment
    @PutMapping("/{postId}/comments/{commentId}")
    public Post editComment(@PathVariable String postId, @PathVariable String commentId, @RequestParam String newText) {
        return postService.editComment(postId, commentId, newText);
    }

    // Delete comment
    @DeleteMapping("/{postId}/comments/{commentId}")
    public Post deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        return postService.deleteComment(postId, commentId);
    }

    // Add reply to a comment
    @PostMapping("/{postId}/comments/{commentId}/replies")
    public Post addReply(@PathVariable String postId, @PathVariable String commentId, @RequestBody Reply reply) {
        return postService.addReply(postId, commentId, reply);
    }
}
