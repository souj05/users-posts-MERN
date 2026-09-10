import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./auth.service";

function Login(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      props.onLoggedIn(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={onLogin}>
      <h2>Login</h2>

      <label>E-Mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error !== "" && <p className="error">{error}</p>}

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p className="form-bottom">
        No account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
}

export default Login;
