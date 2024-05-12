import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginComponent from './components/Login'
import loginService from './services/loginService'
import NewBlogForm from './components/NewBlog'
import Notification from './components/Notification'

const loggedParamName = 'loggedBlogAppUser'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const loggedBlogUser = window.localStorage.getItem(loggedParamName)
    if (loggedBlogUser) {
      const user = JSON.parse(loggedBlogUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  const updateNotification = (message, isErr) => {
    setNotificationMessage(message)
    setIsError(isErr)
    setTimeout(() => {
      setNotificationMessage(null)
      setIsError(false)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        loggedParamName, JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
      updateNotification(null, false)
    } catch (exception) {
      updateNotification("wrong username or password", true)
      console.log(exception)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem(loggedParamName)
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    try {
      const newBlog = await blogService.create(blogObject)
      console.log(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(newBlog))
      updateNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, false)
    } catch (exception) {
      updateNotification("something went wrong, new blog was not added", true)
      console.log(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notificationMessage} isError={isError}></Notification>
        <LoginComponent username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} isError={isError}></Notification>
      <p>{user.username} logged in</p><button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      <NewBlogForm title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} url={url} setUrl={setUrl} addBlog={addBlog}></NewBlogForm>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App