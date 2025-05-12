import React, { useEffect, useState, useCallback } from 'react';
import PostCard from './PostCard';
import { motion } from 'framer-motion';

function HomePage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(() => {
    fetch('http://localhost:8081/api/posts', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected response:", data);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setPosts([]);
      });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        SkillVerse Feed
      </motion.h1>

      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <PostCard post={post} onUpdate={fetchPosts} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
