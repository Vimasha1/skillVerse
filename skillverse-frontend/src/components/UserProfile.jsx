import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import PostCard from "./PostCard";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    if (!userId) return navigate("/login");

    axios
      .get(`http://localhost:8081/api/user-profiles/${userId}`)
      .then((res) => {
        setUserProfile(res.data);

        const postsReq = axios.get(`http://localhost:8081/api/posts/user/${res.data.username}`);
        const plansReq = axios.get(`http://localhost:8081/api/learning-plans/created/${res.data.username}`);
        return Promise.all([postsReq, plansReq]);
      })
      .then(([postRes, planRes]) => {
        setUserPosts(postRes.data);
        setUserPlans(planRes.data);
      })
      .catch(() => setMessage("Error loading profile, posts, or plans."));

    axios
      .get(`http://localhost:8081/api/progress-updates/user/${userId}`)
      .then((res) => setProgressUpdates(res.data))
      .catch(() => setMessage("Error loading updates."));
  }, [userId, navigate]);

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

      const { data } = await axios.get(`http://localhost:8081/api/user-profiles/${userId}`);
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
      await axios.delete(`http://localhost:8081/api/progress-updates/delete/${id}`);
      setProgressUpdates((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setMessage("Error deleting update.");
    }
  };

  const handleToggle = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTemplate = (templateText, extraFields = {}) => {
    let result = templateText;
    Object.entries(extraFields).forEach(([key, value]) => {
      const regex = new RegExp(`%${key}%`, "g");
      result = result.replace(regex, value);
    });
    return result;
  };

  if (!userProfile) return null;

  const sortedUpdates = [...progressUpdates].sort(
    (a, b) => new Date(b.progressDate) - new Date(a.progressDate)
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* PROFILE HEADER */}
      <div className="bg-white shadow mb-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 p-8">
          <div className="relative">
            <img
              src={userProfile.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
            />
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
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {userProfile.firstName} {userProfile.lastName}
            </h1>
            {userProfile.jobPosition && (
              <p className="text-indigo-600 mt-1">{userProfile.jobPosition}</p>
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
                <span>📧</span>
                <span className="underline">{userProfile.email}</span>
              </a>
              <div className="flex items-center space-x-1 hover:text-gray-800">
                <span>📞</span>
                <span>{userProfile.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 items-end">
            <button
              onClick={handleGoToEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/resume")}
              className="px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              ✨ Generate Resume AI
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* INDIVIDUAL INFO */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Individual Information</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="font-medium text-gray-600">Username</dt>
              <dd className="mt-1 text-gray-800">{userProfile.username}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Education</dt>
              <dd className="mt-1 text-gray-800">{userProfile.education || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Address</dt>
              <dd className="mt-1 text-gray-800">{userProfile.address}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Company</dt>
              <dd className="mt-1 text-gray-800">{userProfile.company}</dd>
            </div>
          </dl>
        </section>

        {/* USER PLANS */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">My Learning Plans</h2>
          {userPlans.length === 0 ? (
            <p className="text-gray-600">You haven't created any plans yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <Link to={`/plans/${plan.id}`} className="block">
                    <div className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition">
                      <h2 className="text-xl font-semibold">{plan.title}</h2>
                      <div className="mt-2 h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${Math.round(plan.progress * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">Deadline: {plan.deadline}</p>
                    </div>
                  </Link>

                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Link
                      to={`/plans/${plan.id}/edit`}
                      className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete this plan?")) {
                          await axios.delete(`http://localhost:8081/api/learning-plans/${plan.id}`);
                          setUserPlans((prev) => prev.filter((p) => p.id !== plan.id));
                        }
                      }}
                      className="text-sm bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROGRESS UPDATES */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Progress Updates</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleGoToAddProgress}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                + Add update
              </button>
              <button
                onClick={() => navigate("/all-progress-updates")}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                All updates & analytics
              </button>
            </div>
          </div>

          {message && <p className="mb-4 text-center text-red-600">{message}</p>}

          {sortedUpdates.length === 0 ? (
            <p className="text-gray-600">No updates yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-flex space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400">
                {sortedUpdates.map((update) => {
                  const text = update.templateText
                    ? renderTemplate(update.templateText, update.extraFields)
                    : update.freeText || "";
                  const isExpanded = expandedCards[update.id];
                  const limit = 100;
                  const displayedText = !isExpanded && text.length > limit
                    ? text.substring(0, limit) + "..."
                    : text;

                  return (
                    <div
                      key={update.id}
                      className="w-48 h-auto bg-gray-50 rounded-lg border p-4 flex-shrink-0 shadow-sm"
                    >
                      <h4 className="font-semibold text-sm mb-1 text-indigo-600">
                        {update.category}
                      </h4>
                      <p className="text-gray-800 text-sm">{displayedText}</p>

                      {text.length > limit && (
                        <button
                          onClick={() => handleToggle(update.id)}
                          className="text-blue-500 text-xs mt-1"
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}

                      {update.extraFields &&
                        Object.entries(update.extraFields).map(([key, val]) => (
                          <p key={key} className="text-gray-700 text-xs">
                            <strong>{key}:</strong> {val}
                          </p>
                        ))}

                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(update.progressDate).toLocaleDateString()}
                      </p>

                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEditProgress(update.id)}
                          className="text-sm px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProgress(update.id)}
                          className="text-sm px-2 py-1 bg-red-400 rounded hover:bg-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
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
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfilePage;
