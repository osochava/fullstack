import { useState } from "react";

const Blog = ({ blog, likeBlog, deleteBlog, blogCanBeDeleted }) => {
  const deleteBtnVisibility = { display: blogCanBeDeleted(blog) ? "" : "none" };
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const toggleBtnLabel = visible ? "hide" : "view";
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeHandle = () => {
    likeBlog(blog);
  };

  const removeHandle = () => {
    if (
      window.confirm(
        `Would you like to delete blog ${blog.title} ${blog.author}?`,
      )
    ) {
      deleteBlog(blog);
    }
  };

  return (
    <div style={blogStyle}>
      <div className="info">
        {blog.title} {blog.author}
        <button id="toggle-btn" onClick={toggleVisibility}>
          {toggleBtnLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="fullinfo">
        <div>{blog.url}</div>
        <div>
          likes <span data-testid="blog-likes">{blog.likes}</span>
          <button id="like-btn" onClick={likeHandle}>
            like
          </button>
        </div>
        <div>{blog.user.username}</div>
        <button onClick={removeHandle} style={deleteBtnVisibility}>
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
