import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/style.css";
import Cards from "../components/Cards";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function Index() {
    const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState(courses);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [feedbackMap, setFeedbackMap] = useState({});
    const { user } = useAuth();
    const [reviewText, setReviewText] = useState("");
    const [courseName, setCourseName] = useState("");
    const [rating, setRating] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [startedCourses, setStartedCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    useEffect(() => {
        if (user) {
            loadUserCourses();
        }
    }, [user]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark") {
                document.body.classList.add("dark");
            }

        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }

        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                const data = await res.json();
                setCourses(data);
                setFilteredCourses(data);
            } catch (error) {
                console.error("Помилка отримання курсів: ", error);
            }
        };

        fetchCourses();
    }, [showToast]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            const map = {};
            for (const course of courses) {
                try {
                    const res = await fetch(`/api/reviews/${course.id}`);
                    const data = await res.json();
                    map[course.id] = data;
                } catch (err) {
                    console.error(`Помилка відгуків для ${course.id}:`, err);
                }
            }
            setFeedbackMap(map);
        };

        if (courses.length > 0) {
            fetchFeedbacks();
        }
    }, [courses, showToast]);

    useEffect(() => {
        document.body.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const saveUserCourses = async (started, completed) => {
        if (!user) return;
        const userRef = doc(db, "users", user.email);
        await setDoc(userRef, {
            startedCourses: started,
            completedCourses: completed,
        }, { merge: true });
    };

    const loadUserCourses = async () => {
        if (!user) return;
        const userRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setStartedCourses(data.startedCourses || []);
            setCompletedCourses(data.completedCourses || []);
            setCompletedCoursesCount((data.completedCourses || []).length);
        }
    };


    const handleStartCourse = (course) => {
        const coursesContainer = document.querySelector(".course-grid");
        coursesContainer.prepend(course);
        saveCourseOrder();
    };

    const handleCompleteCourse = (course) => {
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
    };

    const saveCourseOrder = () => {
        const coursesContainer = document.querySelector(".course-grid");
        const courseIds = [...coursesContainer.children].map((course) => course.dataset.id);
        localStorage.setItem("courseOrder", JSON.stringify(courseIds));
    };

    const saveCompletedCourses = () => {
        const completedCourses = [...document.querySelectorAll(".course.completed")].map((course) => course.dataset.id);
        localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
        setCompletedCoursesCount(completedCourses.length);
    };

    const updateGlobalProgress = () => {
        const totalCourses = document.querySelectorAll(".course").length;
        const progressPercent = (completedCoursesCount / totalCourses) * 100;
        const globalProgressBar = document.getElementById("global-progress");
        if (globalProgressBar) {
            globalProgressBar.style.width = progressPercent + "%";
            localStorage.setItem("progress", progressPercent);
        }
    };

    const handleSortCourses = () => {
        const sortedCourses = [...courses].sort((a, b) => a.duration - b.duration);
        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        if (e.target.value === "") {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter((course) => course.category === e.target.value);
            setFilteredCourses(filtered);
        }
    };

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("📤 Надсилаємо POST відгук:", {
                courseId: courseName,
                text: reviewText,
                rating,
                author: user.email
            });
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseId: courseName,
                    text: reviewText,
                    rating,
                    author: user.email
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            console.log("✅ Відгук успішно надіслано:", await response.json());

            setReviewText("");
            setCourseName("");
            setRating(0);
            setShowToast(true);
        } catch (error) {
            console.error("❌ Помилка при надсиланні відгуку:", error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.body.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };


    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/home">Курси</Link></li>
                        <li><Link to="/shedule">Розклад занять</Link></li>
                        <li><Link to="/myCabinet">Мій кабінет</Link></li>
                        <li><button id="theme-toggle" onClick={toggleTheme}>
                                {theme === "dark" ? "🌞 Світла" : "🌙 Темна"}
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <section id="courses">
                    <h2 className="courses-title">Доступні курси</h2>
                    <div>
                        <button className="sort-button" onClick={handleSortCourses}>Сортувати за тривалістю</button>
                        <select onChange={handleCategoryChange} value={selectedCategory}>
                            <option value="">Всі категорії</option>
                            <option value="Programming">Програмування</option>
                            <option value="Web Development">Web-розробка</option>
                            <option value="Mobile Development">Мобільна розробка</option>
                            <option value="Data Science">Аналіз даних</option>
                            <option value="IoT">Інтернет речей</option>
                        </select>
                    </div>

                    <ProgressBar completedCoursesCount={completedCoursesCount} totalCourses={courses.length} />

                    {!user && (
                        <p style={{ marginTop: "1rem", color: "#666" }}>
                            Увійдіть, щоб переглянути деталі курсу або залишити відгук.
                        </p>
                    )}

                    <Cards
                        courses={filteredCourses}
                        handleStartCourse={handleStartCourse}
                        handleCompleteCourse={handleCompleteCourse}
                        isAuthenticated={!!user}
                        startedCourses={startedCourses}
                        completedCourses={completedCourses}
                    />

                </section>

                {user && (
                    <section id="course-feedback">
                        <h3>Залишити відгук про курс</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <select value={courseName} onChange={(e) => setCourseName(e.target.value)} required>
                                <option value="">Оберіть курс</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <span
                                        key={value}
                                        className={rating >= value ? "selected" : ""}
                                        onClick={() => handleStarClick(value)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <textarea
                                placeholder="Ваш відгук..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                            />
                            <button type="submit">Надіслати</button>
                        </form>
                    </section>
                )}

                <section id="course-reviews">
                    <h3>Відгуки користувачів</h3>
                    {Object.entries(feedbackMap).map(([courseId, feedbacks]) => (
                        <div key={courseId}>
                            <h4>
                                Відгуки про курс {courses.find(c => String(c.id) === courseId)?.name || courseId}
                            </h4>
                            <ul>
                                {feedbacks.map((fb, index) => (
                                    <li key={index}>
                                        <strong>{fb.author}</strong> — {fb.text}
                                        <span className="stars">{'★'.repeat(fb.rating || 0)}</span>
                                        <br />
                                        <small style={{ color: "#777" }}>{fb.dateFormatted}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
                {showToast && (
                    <div className="toast show">Відгук надіслано!</div>
                )}
            </main>

            <footer>
                <p>Контакти: stasdatsko04@gmail.com | Телефон: +380675956332</p>
            </footer>
        </div>
    );
}

export default Index;
