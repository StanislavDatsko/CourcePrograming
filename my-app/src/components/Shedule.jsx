import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import '../assets/css/style.css';

function Shedule() {
    const navigate = useNavigate(); // Ініціалізація хука useNavigate
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("/api/schedule");
                const data = await response.json();
                setSchedule(data);
            } catch (error) {
                console.error("Помилка отримання розкладу:", error);
            }
        };

        fetchSchedule();
        
        const coursesContainer = document.querySelector(".course-grid");
        const courses = document.querySelectorAll(".course");

        if (!coursesContainer || courses.length === 0) return;

        function saveCourseOrder() {
            const courseIds = [...coursesContainer.children].map(course => course.dataset.id);
            localStorage.setItem("courseOrder", JSON.stringify(courseIds));
        }

        function restoreCourseOrder() {
            const savedOrder = JSON.parse(localStorage.getItem("courseOrder"));
            if (savedOrder) {
                savedOrder.forEach(id => {
                    const course = document.querySelector(`.course[data-id='${id}']`);
                    if (course) {
                        coursesContainer.appendChild(course);
                    }
                });
            }
        }

        function saveCompletedCourses() {
            const completedCourses = [...document.querySelectorAll(".course.completed")].map(course => course.dataset.id);
            localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
        }

        function restoreCompletedCourses() {
            const completedCourses = JSON.parse(localStorage.getItem("completedCourses"));
            if (completedCourses) {
                completedCourses.forEach(id => {
                    const course = document.querySelector(`.course[data-id='${id}']`);
                    if (course) {
                        course.classList.add("completed");
                        course.style.backgroundColor = "#8BC34A"; 
                        course.style.color = "white";
                        if (!course.querySelector(".completed-text")) {
                            const completedText = document.createElement("p");
                            completedText.classList.add("completed-text");
                            completedText.innerHTML = "<strong>Пройдено</strong>";
                            course.appendChild(completedText);
                        }
                    }
                });
            }
        }

        courses.forEach((course, index) => {
            course.dataset.id = `course-${index}`;
        });

        restoreCourseOrder();
        restoreCompletedCourses();

        courses.forEach(course => {
            const startBtn = course.querySelector(".start-course");
            const completeBtn = course.querySelector(".complete-course");

            startBtn?.addEventListener("click", function () {
                coursesContainer.prepend(course);
                saveCourseOrder();
            });

            completeBtn?.addEventListener("click", function () {
                if (!course.classList.contains("completed")) {
                    course.classList.add("completed");
                    course.style.backgroundColor = "#8BC34A"; 
                    course.style.color = "white";
                    if (!course.querySelector(".completed-text")) {
                        const completedText = document.createElement("p");
                        completedText.classList.add("completed-text");
                        completedText.innerHTML = "<strong>Пройдено</strong>";
                        course.appendChild(completedText);
                    }
                    saveCompletedCourses();
                    updateGlobalProgress();
                }
            });
        });

        let completedCoursesCount = document.querySelectorAll(".course.completed").length;
        const totalCourses = courses.length;
        const globalProgressBar = document.getElementById("global-progress");

        function updateGlobalProgress() {
            const progressPercent = (completedCoursesCount / totalCourses) * 100;
            if (globalProgressBar) {
                globalProgressBar.style.width = progressPercent + "%";
                localStorage.setItem("progress", progressPercent);
            }
        }

        function restoreProgress() {
            const savedProgress = localStorage.getItem("progress");
            if (savedProgress && globalProgressBar) {
                globalProgressBar.style.width = savedProgress + "%";
            }
        }

        restoreProgress();
    }, []);

    // Функція для виходу
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/"); // Перенаправлення на головну сторінку після виходу
    };

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/home">Курси</Link></li>
                        <li><Link to="/shedule">Розклад занять</Link></li>
                        <li><Link to="/myCabinet">Мій кабінет</Link></li>
                    </ul>
                    <button className="logout-button" onClick={handleLogout}>🚪</button> {/* Кнопка для виходу */}
                </nav>
            </header>

            <main>
                <section id="schedule">
                    <h2 className="courses-title">Розклад занять</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Предмет</th>
                                <th>День</th>
                                <th>Час</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.subject}</td>
                                    <td>{item.day}</td>
                                    <td>{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
            
            <footer>
                <p>Контакти: stasdatsko04@gmail.com | Телефон: +380675956332</p>
            </footer>
        </div>
    );
}

export default Shedule;

// Commit: Add schedule table rendering in Shedule component