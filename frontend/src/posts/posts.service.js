import { API_URL } from "../config";
import { getToken } from "../auth/auth.service";

// GET /api/posts?pagesize=2&page=1
export async function getPosts(postsPerPage, currentPage) {
  const res = await fetch(
    API_URL + "/posts?pagesize=" + postsPerPage + "&page=" + currentPage
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  // the backend sends _id, the rest of the app uses id
  const posts = data.posts.map((post) => {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: post.creator
    };
  });

  return { posts: posts, maxPosts: data.maxPosts };
}

export async function getPost(id) {
  const res = await fetch(API_URL + "/posts/" + id);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return {
    id: data._id,
    title: data.title,
    content: data.content,
    imagePath: data.imagePath,
    creator: data.creator
  };
}

export async function addPost(title, content, image) {
  const postData = new FormData();
  postData.append("title", title);
  postData.append("content", content);
  postData.append("image", image, title);

  const res = await fetch(API_URL + "/posts", {
    method: "POST",
    headers: { Authorization: "Bearer " + getToken() },
    body: postData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

// image is either a new File, or the old imagePath string when it wasn't changed
export async function updatePost(id, title, content, image) {
  let options;

  if (typeof image === "object") {
    const postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    options = {
      method: "PUT",
      headers: { Authorization: "Bearer " + getToken() },
      body: postData
    };
  } else {
    options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      })
    };
  }

  const res = await fetch(API_URL + "/posts/" + id, options);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function deletePost(postId) {
  const res = await fetch(API_URL + "/posts/" + postId, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + getToken() }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
}
