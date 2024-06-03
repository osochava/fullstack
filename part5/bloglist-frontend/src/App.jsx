import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginComponent from './components/Login'
import loginService from './services/loginService'
import NewBlogForm from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const loggedParamName = 'loggedBlogAppUser'
const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const compareByLikes = (firstItem, secondItem) => {
    return secondItem.likes - firstItem.likes
  }

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
      blogService.getAll().then(blogs => {
        blogs.sort(compareByLikes)
        setBlogs(blogs)
      }
      )
    }
  }, [user])

  const blogFormRef = useRef()

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
      updateNotification('wrong username or password', true)
      console.log(exception)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem(loggedParamName)
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      console.log(newBlog)
      setBlogs(blogs.concat(newBlog).sort(compareByLikes))
      blogFormRef.current.toggleVisibility()
      updateNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, false)
    } catch (exception) {
      updateNotification('something went wrong, new blog was not added', true)
      console.log(exception)
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      const blogToUpdate =
      {
        author: blogObject.author,
        likes: blogObject.likes + 1,
        title: blogObject.title,
        url: blogObject.url,
        user: blogObject.user.id,
        id: blogObject.id
      }
      const updatedBlog = await blogService.update(blogToUpdate)
      console.log(updatedBlog)
      const updatedBlogs = blogs.map(blog => {
        if (blog.id === updatedBlog.id) {
          return updatedBlog
        }
        else {
          return blog
        }
      })
      updateNotification(`a blog ${updatedBlog.title} by ${updatedBlog.author} liked`, false)
      setBlogs(updatedBlogs.sort(compareByLikes))

    }
    catch (exception) {
      updateNotification('something went wrong, blog haven\'t updated', true)
      console.log(exception)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject)
      updateNotification(`a blog ${blogObject.title} by ${blogObject.author} removed successfully`, false)
      const updatedBlogList = blogs.filter(b => b.id !== blogObject.id)
      setBlogs(updatedBlogList)
    } catch (exception) {
      updateNotification('something went wrong, new blog was not removed', true)
      console.log(exception)
    }
  }

  const blogCanBeDeleted = (blogObject) => {
    return blogObject.user.username === user.username
  }

  const newBlogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <h2>create new</h2>
      <NewBlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notificationMessage} isError={isError}></Notification>
        <LoginComponent
          username={username}
          handleUsernameChange={(name) => { setUsername(name) }}
          password={password}
          handlePasswordChange={(pwd) => { setPassword(pwd) }}
          handleSubmit={handleLogin} />
      </div>
    )
  }

  return (
    <div >
      <h2>blogs</h2>
      <Notification message={notificationMessage} isError={isError}></Notification>
      <div>{user.name} logged in<button onClick={handleLogout}>logout</button></div>
      {newBlogForm()}
      <div data-testid='blogs-list'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} blogCanBeDeleted={blogCanBeDeleted} />
        )}
      </div>
    </div>
  )
}

export default App