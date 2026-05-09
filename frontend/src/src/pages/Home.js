import React, { useState, useEffect } from "react";
import { getStories, toggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, [page]);

  // const fetchStories = async () => {
  //   try {
  //     const response = await getStories(page);
  //     setStories(response.data.stories);
  //     setPagination(response.data.pagination);
  //     console.log(stories);
  //   } catch (error) {
  //     console.error("Error fetching stories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchStories = async () => {
    try {
      const response = await getStories(page);
      console.log("What is response?", response);
      console.log("Full response:", response); // Debug: See what you get
      console.log("Response data:", response.data); // Debug: See the data structure

      // Your API returns { stories: [], pagination: {} } directly
      setStories(response.data.stories || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (storyId) => {
    if (!user) {
      alert("Please login to bookmark stories");
      return;
    }
    try {
      await toggleBookmark(storyId);
      fetchStories(); // Refresh to update bookmark status
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hacker News Stories</h1>
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {story.title}
                </a>
                <div className="text-sm text-gray-600 mt-2">
                  <span>{story.points} points</span>
                  <span className="mx-2">•</span>
                  <span>by {story.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(story.created_at)}</span>
                </div>
              </div>
              {user && (
                <button
                  onClick={() => handleBookmark(story._id)}
                  className="ml-4 text-yellow-500 hover:text-yellow-600 text-2xl"
                >
                  ☆
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
