const LoginComponent = ({ username, setUsername, password, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}>
      </input>
    </div>
    <div>
      password
      <input
        type="text"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}>
      </input>
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginComponent