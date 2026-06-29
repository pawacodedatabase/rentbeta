import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "oluwakido"; // Change this

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function login(e: React.FormEvent) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin-auth", "true");
      navigate("/admin");
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={login}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        {error && (
          <p className="text-red-500 mt-3 text-sm">
            {error}
          </p>
        )}

        <button
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3"
        >
          Login
        </button>
      </form>
    </div>
  );
}