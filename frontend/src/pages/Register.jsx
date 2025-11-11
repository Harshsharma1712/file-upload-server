import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("api/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account ✨</h1>
          <p className="text-center text-sm text-base-content/70 mb-4">
            Join us and start your journey today
          </p>

          {error && (
            <div className="alert alert-error py-2 mb-3">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-success w-full">Register</button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
