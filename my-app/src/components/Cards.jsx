import React from "react";
import { useNavigate } from "react-router-dom";

function Cards({ courses, handleStartCourse, handleCompleteCourse, isAuthenticated }) {
    const [expandedCourseId, setExpandedCourseId] = React.useState(null);
    const navigate = useNavigate();

    const handleDetailsClick = (id) => {
        if (isAuthenticated) {
            setExpandedCourseId(expandedCourseId === id ? null : id);
        } else {
            navigate("/signup");
        }
    };

    return (
        <div className="course-grid">
            {courses.map(course => (
                <article
                    className={`course ${course.status === 'completed' ? 'completed' : ''}`}
                    data-id={course.id}
                    key={course.id}
                >
                    <img src={course.image} alt={course.name} />
                    <h2>{course.name}</h2>
                    <p>Рівень: Початковий</p>
                    <p>Тривалість: {course.duration} тижнів</p>
                    <p>Викладач: {course.instructor}</p>

                    <button
                        className="details-button"
                        style={{ backgroundColor: 'red', color: 'white' }}
                        onClick={() => handleDetailsClick(course.id)}
                    >
                        Деталі курсу
                    </button>

                    {expandedCourseId === course.id && (
                        <div className="course-details">
                            <p>Цей курс охоплює всі базові концепції для початкового рівня. Ви отримаєте фундаментальні знання з теми "{course.name}".</p>
                        </div>
                    )}

                    {course.status === 'completed' && <p className="course-completed-text">Курс пройдено!</p>}

                    <button
                        className="start-course"
                        onClick={(e) => handleStartCourse(e.target.closest('.course'))}
                        disabled={course.status === 'started' || course.status === 'completed'}>
                        Розпочати курс
                    </button>
                    <button
                        className="complete-course"
                        onClick={(e) => handleCompleteCourse(e.target.closest('.course'))}
                        disabled={course.status === 'completed'}>
                        Курс пройдено
                    </button>
                </article>
            ))}
        </div>
    );
}

export default Cards;
