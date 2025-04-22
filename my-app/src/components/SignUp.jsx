import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore"; // Виправлений імпорт
import "../assets/css/signUp.css";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Паролі не співпадають");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Зберігаємо дані користувача в Firestore
            await setDoc(doc(db, "users", user.uid), {
                email
            });

            navigate("/home"); // Перенаправлення на головну сторінку
        } catch (err) {
            setError("Не вдалося зареєструватися: " + err.message);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={handleBack}>&larr;</button>
            <div className="form-container">
                <h2>Реєстрація</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSignUp}>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Підтвердження пароля"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Зареєструватися</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
