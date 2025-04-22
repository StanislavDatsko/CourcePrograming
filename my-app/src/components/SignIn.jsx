import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import "../assets/css/signIn.css";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home"); // Перенаправлення на сторінку курсу
        } catch (err) {
            setError("Неправильний email або пароль");
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="login">
            <button className="back-button" onClick={handleBack}>&larr;</button>
            <div className="form-container">
                <h2>Вхід</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSignIn}>
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
                    <button type="submit">Увійти</button>
                    
                </form>
            </div>
        </div>
    );
}

export default SignIn;
