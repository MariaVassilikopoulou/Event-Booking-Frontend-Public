"use client"
import { useState } from "react";
import styles from "../../styles/Auth.module.scss"
import { useAuthStore } from "@/stores/useAuthStore";
export default function AuthPage(){
    const [isLogin, setIsLogin]= useState(true);
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [fullName, setFullName]= useState("");
    const [message, setMessage]=useState("");

    const toggleMode= ()=> setIsLogin(!isLogin);
    const login = useAuthStore((state) => state.login);

    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault();
        setMessage("");
     
    
    const url= isLogin ? "http://localhost:5038/login"
    : "http://localhost:5038/register";

    const body= isLogin? {email,password}:{email,password,fullName};

    try{
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        }) ;

        if(!res.ok){
            const err= await  res.text();
            setMessage(err || "Something went wrong!");
            return;
        }
        const data= await  res.json();


       /* localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);*/
        login(data.token, data.fullName, data.email);

        setMessage(isLogin? "Login succesfull!": "Acount created!")
        window.location.href="/";
    }catch(error){
        setMessage("Error connecting to server");
    }
}
return(
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>GoEvent</h1>
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

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}