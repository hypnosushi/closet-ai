import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/chat");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail ?? "Registration failed");
      }
      // Auto login after signup
      await login(email, password);
      navigate("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-stone-50 border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 rounded-xl py-2.5 px-4 text-sm text-stone-800 outline-none transition-all duration-200 placeholder:text-stone-300";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF7F2]">
      <div className="w-full max-w-sm px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
            {isSignUp ? "Get started" : "Welcome back"}
          </p>
          <h1 className="text-3xl font-semibold text-stone-800">
            {isSignUp ? "Create your\ncloset." : "Sign in to\nyour closet."}
          </h1>
        </div>

        {/* Form */}
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
            onKeyDown={(e) => !isSignUp && e.key === "Enter" && handleLogin()}
            className={inputClass}
          />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
              className={inputClass}
            />
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            disabled={isLoading}
            className="w-full bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-2xl transition-all duration-200"
          >
            {isLoading
              ? "Please wait..."
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </div>

        {/* Toggle */}
        <p className="text-xs text-stone-400 text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors duration-200"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {!isSignUp && (
          <p className="text-xs text-stone-300 text-center mt-2">
            Demo: demo@closetai.com / password123
          </p>
        )}
      </div>
    </div>
  );
}
