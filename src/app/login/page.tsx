"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./styles.css";
import {
  Eye,
  EyeClosed,
  Lock,
  MoveRight,
  ShieldCheckIcon,
  User,
} from "lucide-react";
import { ErrorIcon } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Username หรือ Password ไม่ถูกต้อง");
      return;
    }

    router.push("/admin/userRegistration");
  };

  return (
    <>
      <div className="login-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        <div className="login-card">
          <div className="card-accent" />

          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <ShieldCheckIcon />
            </div>
            <div>
              <div className="logo-text">Admin Console</div>
              <div className="logo-sub">Secure Access</div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="headline">Seat Event</h1>
          <p className="subline">กรอกข้อมูลเพื่อเข้าสู่ระบบจัดการ</p>

          {/* Error */}
          {error && (
            <div className="error-box">
              <ErrorIcon />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="field">
              <label className="field-label">Username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <User />
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  className="field-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Lock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading}>
              <span className="btn-inner">
                {loading ? (
                  <>
                    <span className="spinner" />
                    กำลังเข้าสู่ระบบ…
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ
                    <MoveRight />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="footer-note">
            Protected by <span>256-bit encryption</span> · Admin only
          </p>
        </div>
      </div>
    </>
  );
}
