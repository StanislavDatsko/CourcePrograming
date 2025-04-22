import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../assets/css/style.css";
import Cards from "../components/Cards";
import ProgressBar from "../components/ProgressBar";
// Removed firebase imports as they are no longer needed

function Index() {
    const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const initCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                const data = await res.json();
                setCourses(data);
                setFilteredCourses(data);
            } catch (error) {
                console.error("Помилка при ініціалізації курсів:", error);
            }
        };

        initCourses();
    }, []);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        
        let filtered = courses;
        if (category) {
            filtered = courses.filter((course) => course.category === category);
        }
        
        setFilteredCourses(filtered);
    };

    const handleSortCourses = () => {
        const sortedCourses = [...courses].sort((a, b) => a.duration - b.duration);
        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
    };

    const handleStartCourse = (courseElement) => {
        const courseId = courseElement.dataset.id;
        const updatedCourses = courses.map(course => 
            course.id === parseInt(courseId) ? { ...course, status: 'started' } : course
        );
        // Після зміни статусу сортуємо список
        const sortedCourses = updatedCourses.sort((a, b) => a.status === 'started' ? -1 : 1);
        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
    };

    const handleCompleteCourse = (courseElement) => {
        const courseId = courseElement.dataset.id;
        const updatedCourses = courses.map(course => 
            course.id === parseInt(courseId) ? { ...course, status: 'completed' } : course
        );

        // Перевірка, чи курс вже завершено, щоб не збільшувати прогрес двічі
        const isAlreadyCompleted = updatedCourses.find(course => course.id === parseInt(courseId)).status === 'completed';
        if (!isAlreadyCompleted) {
            setCompletedCoursesCount(prevCount => prevCount + 1);  // Оновлюємо кількість завершених курсів
        }

        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses);  // Оновлення фільтрованих курсів
    };


    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/SignUp">
                                Зареєструватися
                            </Link>
                        </li>
                        <li>
                            <Link to="/SignIn">
                                Увійти
                            </Link>
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
                    <Cards 
                        courses={filteredCourses} 
                        handleStartCourse={handleStartCourse} 
                        handleCompleteCourse={handleCompleteCourse} 
                    />
                </section>
            </main>

            <footer>
                <p>Контакти: stasdatsko04@gmail.com | Телефон: +380675956332</p>
            </footer>
        </div>
    );
}

export default Index;
