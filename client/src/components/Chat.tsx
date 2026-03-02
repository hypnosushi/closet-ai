import { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import type { ClothingItem } from "../types";

export default function ChatSection() {
  const examples = [
    "Do I already own a yellow dress?",
    "Should I invest in another cashmere sweater?",
    "Show me all of my polka dot items",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (query || isFocused) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % examples.length);
        setVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [query, isFocused, examples.length]);

  const handleSend = () => {
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setQuery("");
  };

  const onSubmit = async (info: Omit<ClothingItem, "id" | "upload_date">) => {
    try {
      const response = await fetch("http://localhost:8000/wardrobe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Item saved:", data);
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  return (
    <div className="flex flex-col justify-between h-[calc(100vh-64px)] w-full max-w-lg px-4 py-8 pb-16">
      <button
        onClick={() => setFormOpen(true)}
        className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-700 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add item
      </button>

      {/* Top label */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1 font-medium">
          Your stylist
        </p>
        <h1 className="text-3xl font-semibold text-stone-800 leading-snug">
          Ask anything about
          <br />
          your wardrobe.
        </h1>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto my-6 space-y-3 pr-1">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2 mt-4">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setQuery(ex)}
                className="text-left text-sm text-stone-500 bg-stone-50 hover:bg-stone-100 hover:text-stone-700 border border-stone-200 hover:border-stone-300 px-4 py-2.5 rounded-2xl transition-all duration-200"
              >
                {ex}
              </button>
            ))}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-stone-900 text-white rounded-br-sm"
                    : "bg-stone-100 text-stone-700 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 rounded-2xl py-3 pl-4 pr-12 text-sm text-stone-800 placeholder-transparent outline-none transition-all duration-200"
          />
          {!query && !isFocused && (
            <span
              className={`pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-stone-400 transition-all duration-300 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {examples[placeholderIndex]}
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!query.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-600 disabled:bg-stone-200 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <ItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
