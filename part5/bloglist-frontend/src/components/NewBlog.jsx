const NewBlogForm = ({ title, setTitle, author, setAuthor, url, setUrl, addBlog }) => (
  <form onSubmit={addBlog}>
    <div>
      title:
      <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}>
      </input>
    </div>
    <div>
      author:
      <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}>
      </input>
    </div>
    <div>
      url:
      <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}>
      </input>
    </div>
    <button type="submit">create</button>
  </form>

)

export default NewBlogForm