'use client'

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LoginBtn() {
    const { data: session, status } = useSession();

    console.log(session);
    console.log(status);

    return (
        <div>
            {status !== 'authenticated' ? 
            <div className="login-btn" onClick={() => {signIn("kakao")}}>
                로그인
            </div>: 

            <div className="logout">
                {session.user.name}님
                <div className="login-btn" onClick={() => {signOut()}}>                
                    로그아웃
                </div>
            </div>
            }
        </div>
        
    );
}