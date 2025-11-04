import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";

export default function Register() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { username, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-xl mb-4 text-center font-bold">Register</h1>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input className="w-full border p-2 mb-3" placeholder="Username"
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="w-full border p-2 mb-3" placeholder="Password" type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full bg-green-500 text-white py-2 rounded">Register</button>
                <p className="text-sm text-center mt-2">
                    Already have account? <Link className="text-blue-600" to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}
