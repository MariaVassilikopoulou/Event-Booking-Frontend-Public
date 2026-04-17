"use client"
import { useState } from "react";
import styles from "../../styles/Auth.module.scss"
import { useAuthStore } from "@/stores/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage(){
    const [isLogin, setIsLogin]= useState(true);
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [fullName, setFullName]= useState("");
    const [loading, setLoading]= useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const login = useAuthStore((state) => state.login);

    const validateEmail = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = () => {
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
    };

    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);

    const url= isLogin ? process.env.NEXT_PUBLIC_API_LOGIN
    : process.env.NEXT_PUBLIC_API_REGISTER;

    const body= isLogin? {email,password}:{email,password,fullName};

    try{
      if (!url) {
        toast.error("Server configuration issue. Please try again later.");
        return;
      }

        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        if(!res.ok){
            const err = await res.text();
            if(res.status === 503 || err.includes("cold start")){
                toast.error("Our server just woke up. Please try again in a few seconds.");
            } else {
                toast.error(err || "Something went wrong!");
            }
            return;
        }

        const data = await res.json();
        login(data.token, data.fullName, data.email, data.isAdmin ?? false);
        toast.success(isLogin ? "Welcome back!" : "Account created!");
        window.location.href="/";
    }catch{
        toast.error("Couldn't reach server. Try again in a few seconds.");
    }finally{
      setLoading(false);
    }}


return(
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>Flowvent</h1>
        <p>Sign in or create an account to book events</p>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className={styles.formWrapper} style={{ position: "relative" }}>
    {loading && (
        <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
        </div>
    )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              required
            />
            <span className={styles.fieldError} role="alert" aria-live="polite">{emailError}</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span className={styles.fieldError} role="alert" aria-live="polite">{passwordError}</span>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}