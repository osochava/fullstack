import PropTypes from "prop-types";

const LoginComponent = ({
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      username
      <input
        data-testid="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => handleUsernameChange(target.value)}
      ></input>
    </div>
    <div>
      password
      <input
        data-testid="password"
        type="text"
        value={password}
        name="Password"
        onChange={({ target }) => handlePasswordChange(target.value)}
      ></input>
    </div>
    <button type="submit">login</button>
  </form>
);

LoginComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginComponent;
