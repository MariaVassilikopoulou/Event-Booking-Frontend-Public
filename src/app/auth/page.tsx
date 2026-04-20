"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, CalendarRange, ShieldCheck, Sparkles } from "lucide-react";
import styles from "../../styles/Auth.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const benefits = [
  {
    icon: Sparkles,
    title: "Easy search",
    copy: "Find events faster.",
  },
  {
    icon: CalendarRange,
    title: "All bookings in one place",
    copy: "See all your bookings.",
  },
  {
    icon: ShieldCheck,
    title: "Simple checkout",
    copy: "Book first. Pay later.",
  },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useAuthStore((state) => state.login);

  function validateEmail() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }

  function validatePassword() {
    if (!isLogin) {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
      } else if (!/[A-Z]/.test(password)) {
        setPasswordError("Password must contain at least one uppercase letter.");
      } else if (!/[0-9]/.test(password)) {
        setPasswordError("Password must contain at least one number.");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const url = isLogin ? process.env.NEXT_PUBLIC_API_LOGIN : process.env.NEXT_PUBLIC_API_REGISTER;
    const body = isLogin ? { email, password } : { email, password, fullName };

    try {
      if (!url) {
        toast.error("Server configuration issue. Please try again later.");
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 503 || errorText.includes("cold start")) {
          toast.error("Our server just woke up. Please try again in a few seconds.");
        } else {
          toast.error(errorText || "Something went wrong.");
        }
        return;
      }

      const data = await response.json();
      login(data.token, data.fullName, data.email, data.isAdmin ?? false);
      toast.success(isLogin ? "Welcome back." : "Account created.");
      window.location.href = "/";
    } catch {
      toast.error("Couldn't reach server. Try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.introPanel}>
          <span className={styles.eyebrow}>Flowvent account</span>
          <h1>Keep your bookings in one place.</h1>
          <p>Sign in to book and pay online.</p>

          <div className={styles.benefitList}>
            {benefits.map(({ icon: Icon, title, copy }) => (
              <article key={title} className={styles.benefitCard}>
                <Icon size={18} />
                <div>
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>

          <Link href="/events" className={styles.exploreLink}>
            Browse current events
          </Link>
        </section>

        <div className={styles.card}>
          <span className={styles.eyebrow}>{isLogin ? "Welcome back" : "Create your account"}</span>
          <h2>{isLogin ? "Sign in to Flowvent" : "Join Flowvent"}</h2>
          <p className={styles.cardLead}>
            {isLogin
              ? "View your bookings."
              : "Create an account to book events."}
          </p>

          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tab} ${isLogin ? styles.active : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>

          <div className={styles.formWrapper}>
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={validateEmail}
                  required
                />
                <span className={styles.fieldError} role="alert" aria-live="polite">
                  {emailError}
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onBlur={validatePassword}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <span className={styles.fieldError} role="alert" aria-live="polite">
                  {passwordError}
                </span>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
