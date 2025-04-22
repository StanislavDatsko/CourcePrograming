import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // Імпортуємо useNavigate
import "../assets/css/welcomePage.css";

function WelcomePage() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate(); // Ініціалізація навігатора

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleSkip = () => {
        navigate("/HomePage");  // Перенаправлення на сторінку HomePage
    };

    return (
        <div className="welcomePage">
            <div className={`welcome-container ${visible ? "visible" : ""}`}>
                <h1>Ласкаво просимо!</h1>
                <p>Будь ласка, увійдіть або зареєструйтеся, щоб отримати доступ до курсів.</p>
                <div>
                    <Link to="/SignIn">
                        <button className="btn">Sign In</button>
                    </Link>
                    <Link to="/SignUp">
                        <button className="btn">Sign Up</button>
                    </Link>
                    {/* Кнопка для пропуску */}
                    <button className="btn skip-button" onClick={handleSkip}>Пропустити</button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
