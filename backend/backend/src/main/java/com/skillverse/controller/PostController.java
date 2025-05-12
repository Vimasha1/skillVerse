package com.skillverse.controller;

import com.skillverse.model.Comment;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
import com.skillverse.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping(consumes = "multipart/form-data")
    public Post createPost(
            @RequestPart("post") Post post,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        return postService.createPostWithFiles(post, files);
    }

    @PostMapping(consumes = "application/json")
    public Post createPostFromJson(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }
    @GetMapping("/{id}")
public Post getPostById(@PathVariable String id) {
    return postService.getPostById(id);
}


    @PutMapping("/{id}")
    public Optional<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        return postService.updatePost(id, updatedPost);
    }

    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        return deleted ? "Post deleted successfully." : "Post not found.";
    }

    @PostMapping("/{postId}/like")
    public Post toggleLike(@PathVariable String postId, @RequestParam String userId) {
        return postService.toggleLike(postId, userId);
    }

    @PostMapping("/{postId}/comments")
    public Post addComment(@PathVariable String postId, @RequestBody Comment comment) {
        return postService.addComment(postId, comment);
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public Post editComment(@PathVariable String postId,
                            @PathVariable String commentId,
                            @RequestParam String newText,
                            @RequestParam String userId) {
        return postService.editComment(postId, commentId, newText, userId);
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public Post deleteComment(@PathVariable String postId,
                              @PathVariable String commentId,
                              @RequestParam String userId) {
        return postService.deleteComment(postId, commentId, userId);
    }

    @PostMapping("/{postId}/comments/{commentId}/replies")
    public Post addReply(@PathVariable String postId,
                         @PathVariable String commentId,
                         @RequestBody Reply reply) {
        return postService.addReply(postId, commentId, reply);
    }

    @PutMapping("/{postId}/comments/{commentId}/replies/{replyId}")
    public Post editReply(@PathVariable String postId,
                          @PathVariable String commentId,
                          @PathVariable String replyId,
                          @RequestParam String newText,
                          @RequestParam String userId) {
        return postService.editReply(postId, commentId, replyId, newText, userId);
    }

    @DeleteMapping("/{postId}/comments/{commentId}/replies/{replyId}")
    public Post deleteReply(@PathVariable String postId,
                            @PathVariable String commentId,
                            @PathVariable String replyId,
                            @RequestParam String userId) {
        return postService.deleteReply(postId, commentId, replyId, userId);
    }

    // Optional: replace full comment list (used for syncing)
    @PutMapping("/{postId}/comments")
    public Post replaceComments(@PathVariable String postId, @RequestBody List<Comment> comments) {
        return postService.replaceComments(postId, comments);
    }
}
