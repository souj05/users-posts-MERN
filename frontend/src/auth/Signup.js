import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "./auth.service";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSignup(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createUser(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={onSignup}>
      <h2>Signup</h2>

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
        {isLoading ? "Creating..." : "Signup"}
      </button>

      <p className="form-bottom">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Signup;
