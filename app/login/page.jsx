"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password.");
      return;
    }
    router.push(params.get("redirect") || "/");
  };

  return (
    <div style={{ maxWidth: 320, margin: "20vh auto", fontFamily: "sans-serif" }}>
      <form onSubmit={submit}>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: "100%", padding: "0.6rem", fontSize: "1rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.6rem", marginTop: "0.5rem" }}>
          Enter
        </button>
        {error && <div style={{ color: "#c0392b", marginTop: "0.5rem" }}>{error}</div>}
      </form>
    </div>
  );
}
