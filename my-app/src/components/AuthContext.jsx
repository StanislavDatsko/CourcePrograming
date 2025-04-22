// src/components/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"; // шлях виправлений
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // POST запит для створення/оновлення користувача на сервері
                    await fetch("/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            uid: currentUser.uid,
                            email: currentUser.email,
                        }),
                    });

                    // GET запит для отримання даних користувача
                    const res = await fetch(`/api/users/${currentUser.uid}`);
                    const userData = await res.json();
                    setUser(userData);
                } catch (error) {
                    console.error("Auth sync error:", error);
                    setUser(currentUser); // fallback
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);