import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialPosts = [
  {
    id: 1,
    name: "LearnHub Tutor",
    content:
      "Welcome to the LearnHub community! Share your questions, ideas and learning experiences with other students.",
    time: "2 hours ago",
    likes: 12,
    liked: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    content:
      "I just completed my first Web Development lesson. The learning experience is really great!",
    time: "5 hours ago",
    likes: 8,
    liked: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    content:
      "Does anyone have useful tips for understanding JavaScript functions? I would love to hear your suggestions.",
    time: "Yesterday",
    likes: 5,
    liked: false,
  },
];

function Community() {
  const { user } = useAuth();

  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("learnhub_community_posts");

    if (!savedPosts) {
      return initialPosts;
    }

    try {
      return JSON.parse(savedPosts);
    } catch {
      return initialPosts;
    }
  });

  const [newPost, setNewPost] = useState("");

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);

    localStorage.setItem(
      "learnhub_community_posts",
      JSON.stringify(updatedPosts)
    );
  };

  const handleCreatePost = (event) => {
    event.preventDefault();

    if (!newPost.trim()) {
      return;
    }

    const post = {
      id: Date.now(),
      name: user?.fullName || "LearnHub Student",
      content: newPost.trim(),
      time: "Just now",
      likes: 0,
      liked: false,
    };

    savePosts([post, ...posts]);
    setNewPost("");
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      return {
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      };
    });

    savePosts(updatedPosts);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold text-blue-600"
          >
            LearnHub
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Courses
            </Link>

            <Link
              to="/my-courses"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              My Courses
            </Link>

            <Link
              to="/profile"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Profile
            </Link>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Community
            </span>

            <Link
              to="/subscription"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Subscription
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            LearnHub Community
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Learn together. Grow together.
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Connect with other learners, ask questions, share ideas and
            celebrate your progress.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {(user?.fullName || "L").charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-bold text-slate-900">
                {user?.fullName || "LearnHub Student"}
              </p>

              <p className="text-sm text-slate-500">
                Share something with the community
              </p>
            </div>
          </div>

          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              placeholder="What are you learning today?"
              rows="4"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {post.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    {post.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {post.time}
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-slate-700">
                {post.content}
              </p>

              <div className="mt-5 flex items-center border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    post.liked
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                   {post.liked ? "Liked" : "Like"} · {post.likes}
                </button>

                <button
                  type="button"
                  className="ml-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                   Comment
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">
            Keep learning. Keep sharing.
          </h2>

          <p className="mt-2 text-blue-100">
            Your knowledge can help another learner succeed.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Community;