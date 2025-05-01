package com.skillverse.service;

import com.skillverse.model.Post;
import com.skillverse.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Date;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    public Post createPost(Post post) {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Update a post
    public Optional<Post> updatePost(String id, Post updatedPost) {
        Optional<Post> optionalPost = postRepository.findById(id);

        if (optionalPost.isPresent()) {
            Post existingPost = optionalPost.get();
            existingPost.setDescription(updatedPost.getDescription());
            existingPost.setMediaUrls(updatedPost.getMediaUrls());
            existingPost.setUpdatedAt(new Date());
            postRepository.save(existingPost);
            return Optional.of(existingPost);
        } else {
            return Optional.empty();
        }
    }

    // Delete a post
    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
