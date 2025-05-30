// "use client"

// import { useEffect, useRef } from "react"
// import { signOut } from "next-auth/react"

// const AutoLogout = ({ timeout = 3600000 }) => { // 1 tiếng = 3600000 ms
//     const timer = useRef(null)

//     const resetTimer = () => {
//         if (timer.current) clearTimeout(timer.current)
//         timer.current = setTimeout(() => {
//             console.log("Không hoạt động quá lâu, đăng xuất...")
//             signOut()
//         }, timeout)
//     }

//     useEffect(() => {
//         // Reset khi có hoạt động
//         const events = ["mousemove", "keydown", "scroll", "click"]

//         for (let event of events) {
//             window.addEventListener(event, resetTimer)
//         }

//         // Reset cả khi người dùng quay lại tab
//         document.addEventListener("visibilitychange", () => {
//             if (!document.hidden) resetTimer()
//         })

//         // Thiết lập ban đầu
//         resetTimer()

//         return () => {
//             for (let event of events) {
//                 window.removeEventListener(event, resetTimer)
//             }
//             clearTimeout(timer.current)
//         }
//     }, [])

//     return null
// }

// export default AutoLogout

"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AutoLogout({ timeout = 3600000 }) {
    const { status } = useSession();
    const router = useRouter();
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (status !== "authenticated") return;

        const EVENTS = ["mousemove", "keydown", "scroll", "click"];

        const resetTimer = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                alert("Bạn đã không hoạt động trong một thời gian dài. Hệ thống sẽ tự động đăng xuất.");
                signOut({ redirect: true, callbackUrl: "/login" });
            }, timeout);
        };

        EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer(); // khởi động bộ đếm lúc đầu

        return () => {
            EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [status, timeout]);

    return null;
}
