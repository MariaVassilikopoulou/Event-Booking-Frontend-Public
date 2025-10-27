"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Header.module.scss"

export default function Header(){
    const [user, setUser]= useState<string|null>(null);

    useEffect(()=>{
        const storeUser= localStorage.getItem("userName");
        if(storeUser) setUser(storeUser);
    },[]);

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUser(null);
    }


    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <p>EventBookingPlatform</p>
                <Link href="/" >GoEvent</Link>
            </div>
            <div className={styles.right}>
                {user?(
                    <>
                    <span>Welcome, {user}</span>
                    <button onClick={handleLogout} className={styles.logout}>Logout</button>
                    </>
                ):(
                    <Link href="/auth" className={styles.loginButton}> Login</Link>
                )}
            </div>
        </header>
    ) ;
}