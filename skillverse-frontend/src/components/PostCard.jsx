import React, { useState } from 'react';

function PostCard({ post }) {
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState(post.comments || []);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      userId: "guest_user",
      text: comment,
    };

    fetch(`http://localhost:8081/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        setCommentList(updatedPost.comments || []);
        setComment('');
      })
      .catch((err) => console.error('Error adding comment:', err));
  };

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h2 className="text-xl font-semibold">{post.skillName}</h2>
      <p className="text-gray-700">{post.description}</p>

      <div className="grid grid-cols-2 gap-4 my-4">
        {post.mediaUrls?.map((url, idx) =>
          url.endsWith('.mp4') ? (
            <video key={idx} controls className="w-full h-auto rounded">
              <source src={url} type="video/mp4" />
            </video>
          ) : (
            <img key={idx} src={url} alt="media" className="w-full h-auto rounded" />
          )
        )}
      </div>

      <div className="mt-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="border border-gray-300 rounded px-3 py-1 w-3/4 mr-2"
        />
        <button onClick={handleCommentSubmit} className="bg-blue-500 text-white px-4 py-1 rounded">
          Comment
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-800">
        {commentList.map((c, i) => (
          <div key={i} className="border-t pt-2 mt-2">
            <strong>{c.userId || 'Anonymous'}:</strong> {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostCard;
