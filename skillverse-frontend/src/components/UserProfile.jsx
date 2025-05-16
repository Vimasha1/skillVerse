// src/components/UserProfilePage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import PostCard from "./PostCard";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  // load profile, their posts and plans, and updates
  useEffect(() => {
    if (!userId) return navigate("/login");

    // 1) profile + posts+plans
    axios
      .get(`http://localhost:8081/api/user-profiles/${userId}`)
      .then((res) => {
        setUserProfile(res.data);
        const username = res.data.username;
        return Promise.all([
          axios.get(`http://localhost:8081/api/posts/user/${username}`),
          axios.get(
            `http://localhost:8081/api/learning-plans/created/${username}`
          ),
        ]);
      })
      .then(([postRes, planRes]) => {
        setUserPosts(postRes.data);
        setUserPlans(planRes.data);
      })
      .catch(() =>
        setMessage("Error loading profile, shared posts, or plans.")
      );

    // 2) their progress updates
    axios
      .get(`http://localhost:8081/api/progress-updates/user/${userId}`)
      .then((res) => setProgressUpdates(res.data))
      .catch(() => setMessage("Error loading progress updates."));
  }, [userId, navigate]);

  // picture upload
  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    try {
      await axios.post(
        `http://localhost:8081/api/user-profiles/upload/${userId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { data } = await axios.get(
        `http://localhost:8081/api/user-profiles/${userId}`
      );
      setUserProfile(data);
      sessionStorage.setItem("userProfile", JSON.stringify(data));
      window.location.reload();
    } catch {
      setMessage("Could not upload picture.");
    }
  };

  const handleGoToEdit = () => navigate(`/user-profiles/edit/${userId}`);
  const handleGoToAddProgress = () => navigate("/progress-update");
  const handleEditProgress = (id) => navigate(`/progress-update/edit/${id}`);
  const handleDeleteProgress = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/progress-updates/delete/${id}`
      );
      setProgressUpdates((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setMessage("Error deleting progress update.");
    }
  };

  // post edit/delete
  const handleDeletePost = async (postId) => {
    if (
      window.confirm("Are you sure you want to delete this post permanently?")
    ) {
      try {
        await axios.delete(`http://localhost:8081/api/posts/${postId}`);
        setUserPosts((prev) => prev.filter((p) => p.id !== postId));
      } catch {
        alert("Failed to delete post.");
      }
    }
  };

  const handleToggle = (id) =>
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderTemplate = (templateText, extraFields = {}) => {
    let result = templateText;
    Object.entries(extraFields).forEach(([key, value]) => {
      result = result.replace(new RegExp(`%${key}%`, "g"), value);
    });
    return result;
  };

  if (!userProfile) return null;

  const sortedUpdates = [...progressUpdates].sort(
    (a, b) => new Date(b.progressDate) - new Date(a.progressDate)
  );

  // who's viewing: may be themselves or another
  const me = JSON.parse(sessionStorage.getItem("userProfile"));
  const amI = me?.id === userId;

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* PROFILE HEADER */}
      <div className="bg-white shadow mb-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-8">
          <div className="relative">
            <img
              src={userProfile.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
            />
            {amI && (
              <>
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-50 cursor-pointer"
                >
                  ✏️
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureChange}
                />
              </>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {userProfile.firstName} {userProfile.lastName}
            </h1>
            {userProfile.jobPosition && (
              <p className="text-indigo-600 mt-1">
                {userProfile.jobPosition}
              </p>
            )}
            <div className="flex space-x-6 mt-2 text-gray-600">
              <div>
                <span className="font-semibold">
                  {userProfile.followers?.length || 0}
                </span>{" "}
                Followers
              </div>
              <div>
                <span className="font-semibold">
                  {userProfile.following?.length || 0}
                </span>{" "}
                Following
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-6 mt-4 text-gray-600">
              <a
                href={`mailto:${userProfile.email}`}
                className="flex items-center space-x-1 hover:text-gray-800"
              >
                📧 <span className="underline">{userProfile.email}</span>
              </a>
              <div className="flex items-center space-x-1 hover:text-gray-800">
                📞 <span>{userProfile.phone}</span>
              </div>
            </div>
          </div>

          {amI && (
            <div className="flex flex-col space-y-3 items-end">
              <button
                onClick={handleGoToEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/resume")}
                className="px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                ✨ Generate Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* INDIVIDUAL INFO */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Individual Information
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-600">Username</dt>
              <dd className="mt-1 text-gray-800">
                {userProfile.username}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Education</dt>
              <dd className="mt-1 text-gray-800">
                {userProfile.education || "—"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Address</dt>
              <dd className="mt-1 text-gray-800">
                {userProfile.address}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Company</dt>
              <dd className="mt-1 text-gray-800">
                {userProfile.company}
              </dd>
            </div>
          </dl>
        </section>

        {/* MY LEARNING PLANS */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            My Learning Plans
          </h2>
          {userPlans.length === 0 ? (
            <p className="text-gray-600">
              You haven’t created any plans yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <Link to={`/plans/${plan.id}`} className="block">
                    <div className="p-4 border rounded shadow-sm hover:shadow-md transition">
                      <h3 className="text-lg font-semibold">
                        {plan.title}
                      </h3>
                      <div className="mt-2 h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${Math.round(plan.progress * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Deadline: {plan.deadline}
                      </p>
                    </div>
                  </Link>
                  {/* only creator can edit/delete */}
                  {amI && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Link
                        to={`/plans/${plan.id}/edit`}
                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Delete this plan permanently?"
                            )
                          ) {
                            await axios.delete(
                              `http://localhost:8081/api/learning-plans/${plan.id}`
                            );
                            setUserPlans((prev) =>
                              prev.filter((p) => p.id !== plan.id)
                            );
                          }
                        }}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROGRESS UPDATES */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Progress Updates
            </h2>
            {amI && (
              <div className="flex space-x-2">
                <button
                  onClick={handleGoToAddProgress}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg"
                >
                  + Add update
                </button>
                <button
                  onClick={() => navigate("/all-progress-updates")}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
                >
                  All updates & analytics
                </button>
              </div>
            )}
          </div>
          {message && (
            <p className="mb-4 text-center text-red-600">{message}</p>
          )}
          {sortedUpdates.length === 0 ? (
            <p className="text-gray-600">No updates yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-flex space-x-4 pb-2">
                {sortedUpdates.map((u) => {
                  const text = u.templateText
                    ? renderTemplate(u.templateText, u.extraFields)
                    : u.freeText || "";
                  const isExpanded = expandedCards[u.id];
                  const limit = 100;
                  const displayed = !isExpanded && text.length > limit
                    ? text.substring(0, limit) + "..."
                    : text;
                  return (
                    <div
                      key={u.id}
                      className="w-48 bg-gray-50 rounded-lg border p-4 shadow-sm"
                    >
                      <h4 className="font-semibold text-indigo-600">
                        {u.category}
                      </h4>
                      <p className="text-gray-800">{displayed}</p>
                      {text.length > limit && (
                        <button
                          onClick={() => handleToggle(u.id)}
                          className="text-xs text-blue-500 mt-1"
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(u.progressDate).toLocaleDateString()}
                      </p>
                      {amI && (
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleEditProgress(u.id)}
                            className="text-xs px-2 py-1 bg-yellow-400 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProgress(u.id)}
                            className="text-xs px-2 py-1 bg-red-400 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
{/* SHARED POSTS */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Shared Posts</h2>
          {userPosts.length === 0 ? (
            <p className="text-gray-600">No posts shared yet.</p>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} />
                  {amI && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {/* NOW uses navigate() instead of Link */}
                      <button
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
