import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, addPost, updatePost } from "./posts.service";

function PostCreate() {
  const params = useParams();
  const navigate = useNavigate();

  // no postId in the url means we are creating, otherwise we are editing
  const mode = params.postId ? "edit" : "create";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.postId) {
      return;
    }

    setIsLoading(true);

    getPost(params.postId)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setImagePreview(post.imagePath);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [params.postId]);

  function onImagePicked(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setError("Please pick a png or jpg image");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function onSavePost(event) {
    event.preventDefault();

    if (title.trim().length < 3) {
      setError("The title needs at least 3 characters");
      return;
    }
    if (content.trim() === "") {
      setError("Please write some content");
      return;
    }
    // the backend needs an image on a new post
    if (mode === "create" && !image) {
      setError("Please pick an image");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await addPost(title, content, image);
      } else {
        // if no new image was picked, send the old path back
        await updatePost(params.postId, title, content, image ? image : imagePreview);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p className="info">Loading...</p>;
  }

  return (
    <form className="card" onSubmit={onSavePost}>
      <h2>{mode === "create" ? "New Post" : "Edit Post"}</h2>

      <label>Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Content</label>
      <textarea rows="4" value={content} onChange={(e) => setContent(e.target.value)} />

      <label>Image</label>
      <input type="file" accept="image/png, image/jpeg" onChange={onImagePicked} />

      {imagePreview !== "" && (
        <img src={imagePreview} alt="Preview" className="post-image" />
      )}

      {error !== "" && <p className="error">{error}</p>}

      <button type="submit" className="btn">
        Save Post
      </button>
    </form>
  );
}

export default PostCreate;
