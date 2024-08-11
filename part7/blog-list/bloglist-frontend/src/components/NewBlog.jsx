import { useState } from "react";

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };
    createBlog(blogObject);
    console.log(blogObject);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          id="title-input"
          onChange={({ target }) => setTitle(target.value)}
        ></input>
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          id="author-input"
          onChange={({ target }) => setAuthor(target.value)}
        ></input>
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          id="url-input"
          onChange={({ target }) => setUrl(target.value)}
        ></input>
      </div>
      <button id="create-btn" type="submit">
        create
      </button>
    </form>
  );
};

export default NewBlogForm;
