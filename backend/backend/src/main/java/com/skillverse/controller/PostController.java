// src/main/java/com/skillverse/controller/PostController.java

package com.skillverse.controller;

import com.skillverse.model.Comment;
import com.skillverse.model.Post;
import com.skillverse.model.Reply;
import com.skillverse.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    /** Create new with files */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Post createPost(
            @RequestPart("post") Post post,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        return postService.createPostWithFiles(post, files);
    }

    /** Create JSON‐only new post */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Post createPostFromJson(@RequestBody Post post) {
        return postService.createPost(post);
    }

    /** List all */
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    /** Single by id */
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        return postService.getPostById(id);
    }

    /**
     * FULL edit including optional new files: client sends:
     *  - part "post": JSON with updated text fields + mediaUrls[] to KEEP
     *  - part "files": zero or more new uploads
     */
    @PutMapping(
      value = "/{id}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Post updatePostWithFiles(
      @PathVariable String id,
      @RequestPart("post") Post updatedPost,
      @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        try {
            return postService.updateWithFiles(id, updatedPost, files);
        } catch (IOException ex) {
            throw new ResponseStatusException(
              HttpStatus.INTERNAL_SERVER_ERROR, "Failed saving files", ex
            );
        }
    }

    /** JSON‐only edit (no file churn) */
    @PutMapping(
      value = "/{id}",
      consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public Post updatePost(
      @PathVariable String id,
      @RequestBody Post updatedPost
    ) {
        Optional<Post> maybe = postService.updatePost(id, updatedPost);
        return maybe.orElseThrow(() ->
          new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found")
        );
    }

    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        return deleted
             ? "Post deleted successfully."
             : "Post not found.";
    }

    @PostMapping("/{postId}/like")
    public Post toggleLike(@PathVariable String postId,
                           @RequestParam String userId) {
        return postService.toggleLike(postId, userId);
    }

    @PostMapping("/{postId}/comments")
    public Post addComment(@PathVariable String postId,
                           @RequestBody Comment comment) {
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

    // replace entire comment list
    @PutMapping("/{postId}/comments")
    public Post replaceComments(@PathVariable String postId,
                                @RequestBody List<Comment> comments) {
        return postService.replaceComments(postId, comments);
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postService.getPostsByUserId(userId);
    }
}
