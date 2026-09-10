import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost } from "./posts.service";

function PostList(props) {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSizeOptions = [1, 2, 5, 10];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  useEffect(() => {
    setIsLoading(true);

    getPosts(postsPerPage, currentPage)
      .then((data) => {
        setPosts(data.posts);
        setTotalPosts(data.maxPosts);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [postsPerPage, currentPage]);

  async function onDelete(postId) {
    if (!window.confirm("Delete this post?")) {
      return;
    }

    setIsLoading(true);

    try {
      await deletePost(postId);

      // reload the current page so the paging stays right
      const data = await getPosts(postsPerPage, currentPage);
      setPosts(data.posts);
      setTotalPosts(data.maxPosts);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  function changePageSize(event) {
    setPostsPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  if (isLoading) {
    return <p className="info">Loading...</p>;
  }

  if (error !== "") {
    return <p className="error">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="info">No posts added yet!</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div className="card post" key={post.id}>
          <h3>{post.title}</h3>

          {post.imagePath !== "" && (
            <img src={post.imagePath} alt={post.title} className="post-image" />
          )}

          <p>{post.content}</p>

          {props.userIsAuthenticated && props.userId === post.creator && (
            <div className="post-actions">
              <Link to={"/edit/" + post.id} className="btn">
                Edit
              </Link>
              <button className="btn delete" onClick={() => onDelete(post.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="paginator">
        <button
          className="link-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="link-btn"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

        <select value={postsPerPage} onChange={changePageSize}>
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default PostList;
