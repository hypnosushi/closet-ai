import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/chat");
    } catch {
      setError("Invalid email or password");
    }
  };

  const inputClass =
    "w-full bg-stone-50 border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 rounded-xl py-2.5 px-4 text-sm text-stone-800 outline-none transition-all duration-200 placeholder:text-stone-300";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF7F2]">
      <div className="w-full max-w-sm px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-stone-800">
            Sign in to
            <br />
            your closet.
          </h1>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={inputClass}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium py-3 rounded-2xl transition-all duration-200"
          >
            Sign in
          </button>
        </div>

        <p className="text-xs text-stone-400 text-center mt-4">
          Demo account: demo@closetai.com / password123
        </p>
      </div>
    </div>
  );
}
