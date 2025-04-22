document.addEventListener("DOMContentLoaded", function () {
    const coursesContainer = document.querySelector(".course-grid");
    const courses = document.querySelectorAll(".course");

    // Функція збереження порядку курсів у localStorage
    function saveCourseOrder() {
        const courseIds = [...coursesContainer.children].map(course => course.dataset.id);
        localStorage.setItem("courseOrder", JSON.stringify(courseIds));
    }

    // Функція відновлення порядку курсів
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
    
    // Функція збереження завершених курсів
    function saveCompletedCourses() {
        const completedCourses = [...document.querySelectorAll(".course.completed")].map(course => course.dataset.id);
        localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
    }

    // Функція відновлення завершених курсів
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

    // Додаємо унікальні data-id для курсів (щоб зберігати порядок)
    courses.forEach((course, index) => {
        course.dataset.id = `course-${index}`;
    });

    // Відновлюємо порядок та статус завершення курсів
    restoreCourseOrder();
    restoreCompletedCourses();

    // Кнопки "Розпочати курс" та "Курс пройдено"
    courses.forEach(course => {
        const startBtn = course.querySelector(".start-course");
        const completeBtn = course.querySelector(".complete-course");

        // Переміщення курсу вгору
        startBtn.addEventListener("click", function () {
            coursesContainer.prepend(course);
            saveCourseOrder();
        });

        // Завершення курсу
        completeBtn.addEventListener("click", function () {
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

    // Оновлення шкали прогресу
    let completedCoursesCount = document.querySelectorAll(".course.completed").length;
    const totalCourses = courses.length;
    const globalProgressBar = document.getElementById("global-progress");

    function updateGlobalProgress() {
        const progressPercent = (completedCoursesCount / totalCourses) * 100;
        globalProgressBar.style.width = progressPercent + "%";
        localStorage.setItem("progress", progressPercent);
    }

    // Відновлення шкали прогресу
    function restoreProgress() {
        const savedProgress = localStorage.getItem("progress");
        if (savedProgress) {
            globalProgressBar.style.width = savedProgress + "%";
        }
    }

    restoreProgress();
});


