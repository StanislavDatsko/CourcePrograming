import React from "react";

function ProgressBar({ completedCoursesCount, totalCourses }) {
    const progressPercent = (completedCoursesCount / totalCourses) * 100;

    return (
        <div className="progress-container">
            <span className="progress-title">Прогрес: {completedCoursesCount} з {totalCourses} курсів</span>
            <div className="progress-bar-container">
                <div
                    id="global-progress"
                    className="progress-bar"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </div>
    );
}

export default ProgressBar;
