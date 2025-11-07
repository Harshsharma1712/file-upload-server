import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("api/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-xl mb-4 text-center font-bold">Login</h1>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input className="w-full border p-2 mb-3" placeholder="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <input className="w-full border p-2 mb-3" placeholder="Password" type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
                <p className="text-sm text-center mt-2">
                    No account? <Link className="text-blue-600" to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}
