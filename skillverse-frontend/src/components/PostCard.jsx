import React, { useState, useCallback, useEffect } from 'react';
import {
  HandThumbUpIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function PostCard({ post, onUpdate }) {
  const user = JSON.parse(sessionStorage.getItem('userProfile'));
const userId = user?.username ?? 'guest_user';  // ✅ now using username

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

  const [likes, setLikes]               = useState(post.likes ?? []);
  const [commentList, setCommentList]   = useState(post.comments ?? []);
  const [comment, setComment]           = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState({});
  const [replies, setReplies]           = useState({});
  const [showComments, setShowComments] = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    setLikes(post.likes ?? []);
    setCommentList(post.comments ?? []);
  }, [post.likes, post.comments]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${post.id}`, { credentials: 'include' });
      const data = await res.json();
      setCommentList(data.comments ?? []);
    } catch (e) {
      console.error(e);
    }
  }, [BASE_URL, post.id]);

  const handleLike = useCallback(() => {
    if (!user) { toast.info('Please log in to like posts'); return; }

    const hasLiked = likes.includes(userId);
    setLikes(hasLiked ? likes.filter(id => id !== userId) : [...likes, userId]);

    fetch(`${BASE_URL}/api/posts/${post.id}/like?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        setLikes(data.likes ?? []);
        onUpdate?.();
      })
      .catch(() => {
        setLikes(likes);
        setError('Could not update like. Please try again.');
      });
  }, [BASE_URL, post.id, likes, userId, user, onUpdate]);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    if (!user) { toast.info('Please log in to comment'); return; }

    const isEdit = Boolean(editingComment);
    const url = isEdit
      ? `${BASE_URL}/api/posts/${post.id}/comments/${editingComment}` +
        `?newText=${encodeURIComponent(comment)}` +
        `&userId=${encodeURIComponent(userId)}`
      : `${BASE_URL}/api/posts/${post.id}/comments`;

    const method = isEdit ? 'PUT' : 'POST';
    const body   = isEdit ? null : JSON.stringify({ userId, text: comment });

    fetch(url, {
      method,
      headers: isEdit ? {} : { 'Content-Type': 'application/json' },
      credentials: 'include',
      body,
    })
      .then(r => r.json())
      .then(() => {
        setComment('');
        setEditingComment(null);
        fetchComments();
        onUpdate?.();
      })
      .catch(() => setError('Error submitting comment.'));
  };

  const handleCommentDelete = cid => {
    fetch(`${BASE_URL}/api/posts/${post.id}/comments/${cid}` +
          `?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(() => {
      fetchComments();
      onUpdate?.();
    });
  };

  const handleReplyChange = (cid, text) => {
    setReplies(prev => ({ ...prev, [cid]: text }));
  };

  const handleReplySubmit = cid => {
    const replyText = (replies[cid] || '').trim();
    if (!replyText) return;
    if (!user) { toast.info('Please log in to reply'); return; }

    const isEdit = Boolean(editingReply[cid]);
    const url = isEdit
      ? `${BASE_URL}/api/posts/${post.id}/comments/${cid}/replies/${editingReply[cid]}` +
        `?newText=${encodeURIComponent(replyText)}` +
        `&userId=${encodeURIComponent(userId)}`
      : `${BASE_URL}/api/posts/${post.id}/comments/${cid}/replies`;

    const method = isEdit ? 'PUT' : 'POST';
    const body   = isEdit ? null : JSON.stringify({ userId, text: replyText });

    fetch(url, {
      method,
      headers: isEdit ? {} : { 'Content-Type': 'application/json' },
      credentials: 'include',
      body,
    })
      .then(r => r.json())
      .then(() => {
        setReplies(prev => ({ ...prev, [cid]: '' }));
        setEditingReply(prev => ({ ...prev, [cid]: null }));
        fetchComments();
        onUpdate?.();
      })
      .catch(() => setError('Error submitting reply.'));
  };

  const handleReplyDelete = (cid, rid) => {
    fetch(`${BASE_URL}/api/posts/${post.id}/comments/${cid}/replies/${rid}` +
          `?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(() => {
      fetchComments();
      onUpdate?.();
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 mb-6">
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* —————— POST HEADER —————— */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold">{post.skillName}</h2>
        <p className="text-sm text-gray-500">
          Posted by{' '}
          <Link to={`/public-profile/${post.userId}`} className="text-blue-600 hover:underline">
            {post.userId}
          </Link>
        </p>
      </div>

      {/* —————— DESCRIPTION —————— */}
      <p className="text-gray-700">{post.description}</p>

      {/* —————— MEDIA COLLAGE —————— */}
      {post.mediaUrls?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 my-4">
          {post.mediaUrls.map(url =>
            url.endsWith('.mp4')
              ? <video key={url} controls className="w-full h-auto rounded">
                  <source src={`${BASE_URL}${url}`} type="video/mp4" />
                </video>
              : <img key={url} src={`${BASE_URL}${url}`} alt="" className="w-full h-auto rounded" />
          )}
        </div>
      )}

      {/* —————— ACTIONS —————— */}
      <div className="flex space-x-4 mt-4 text-sm text-gray-600">
        <button onClick={handleLike} className="flex items-center space-x-1 hover:text-blue-500">
          <HandThumbUpIcon className="w-5 h-5" />
          <span>{likes.includes(userId) ? 'Unlike' : 'Like'} ({likes.length})</span>
        </button>
        <button onClick={() => setShowComments(v => !v)} className="flex items-center space-x-1 hover:text-blue-500">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
          <span>Comment</span>
        </button>
      </div>

      {/* —————— COMMENTS & REPLIES —————— */}
      {showComments && (
        <div className="mt-4">
          {/* new/edit comment box */}
          <div className="flex items-center mb-4">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment"
              className="border border-gray-300 rounded px-3 py-1 w-3/4 mr-2"
            />
            <button onClick={handleCommentSubmit}
                    className="bg-blue-500 text-white px-4 py-1 rounded">
              {editingComment ? 'Update' : 'Post'}
            </button>
          </div>

          {/* list of comments */}
          {commentList.map(c => (
            <div key={c.id} className="border-t pt-2 mt-2 text-sm text-gray-800">
              <strong>
                <Link to={`/public-profile/${c.userId}`} className="text-blue-600 hover:underline">
                  {c.userId}
                </Link>:
              </strong> {c.text}
              {c.userId === userId && (
                <div className="space-x-2 text-xs mt-1 text-blue-600">
                  <button onClick={() => { setComment(c.text); setEditingComment(c.id); }}>
                    <PencilIcon className="w-4 h-4 inline" /> Edit
                  </button>
                  <button onClick={() => handleCommentDelete(c.id)}>
                    <TrashIcon className="w-4 h-4 inline" /> Delete
                  </button>
                </div>
              )}

              {/* replies */}
              <div className="ml-4 mt-2">
                {c.replies?.map(r => (
                  <div key={r.id} className="mb-1 text-sm">
                    <ArrowUturnLeftIcon className="inline w-4 h-4 mr-1" />
                    <strong>
                      <Link to={`/public-profile/${r.userId}`} className="text-blue-600 hover:underline">
                        {r.userId}
                      </Link>:
                    </strong> {r.text}
                    {r.userId === userId && (
                      <span className="inline ml-2 text-xs text-blue-600 space-x-2">
                        <button onClick={() => {
                          setReplies(prev => ({ ...prev, [c.id]: r.text }));
                          setEditingReply(prev => ({ ...prev, [c.id]: r.id }));
                        }}>
                          <PencilIcon className="w-4 h-4 inline" /> Edit
                        </button>
                        <button onClick={() => handleReplyDelete(c.id, r.id)}>
                          <TrashIcon className="w-4 h-4 inline" /> Delete
                        </button>
                      </span>
                    )}
                  </div>
                ))}

                <div className="flex mt-2">
                  <input
                    value={replies[c.id] || ''}
                    onChange={e => handleReplyChange(c.id, e.target.value)}
                    placeholder="Reply..."
                    className="border border-gray-300 rounded px-2 py-1 w-2/3 mr-2"
                  />
                  <button onClick={() => handleReplySubmit(c.id)}
                          className="bg-gray-200 px-3 py-1 rounded text-sm">
                    {editingReply[c.id] ? 'Update' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(PostCard);