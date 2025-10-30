"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Header.module.scss"
import { useAuthStore } from "@/stores/useAuthStore";

export default function Header(){
    const [user, setUser]= useState<string|null>(null);
    const { isLoggedIn, userName, logout } = useAuthStore();
    useEffect(()=>{
        const storeUser= localStorage.getItem("userName");
        if(storeUser) setUser(storeUser);
    },[]);

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        setUser(null);
    }


    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <p>EventBookingPlatform</p>
                <Link href="/" >Flowvent</Link>
            </div>
            <div className={styles.right}>
            {isLoggedIn ? (
                    <>
                    <span>Welcome, {user}</span>
                    <button onClick={logout} className={styles.logout}>Logout</button>
                    </>
                ):(
                    <Link href="/auth" className={styles.loginButton}> Login</Link>
                )}
            </div>
        </header>
    ) ;
}