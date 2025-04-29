// server.js
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');


const app = express();
console.log("⚙️ Express initialized");
const PORT = process.env.PORT || 5230;

// Middlewares
app.use(cors());
app.use(express.json());

// Firebase
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Firebase service account key (serviceAccountKey.json) not found!');
    process.exit(1);
}

initializeApp({
    credential: cert(serviceAccountPath),
});
console.log("🔥 Firebase initialized");

const db = getFirestore();
const reviewsCollection = db.collection('feedbacks');
const coursesCollection = db.collection('courses');
const scheduleCollection = db.collection('schedule');
const usersCollection = db.collection('users');
console.log("🛣 Routes registered");

// GET: отримати відгуки про курс з dateFormatted і сортуванням за спаданням
app.get('/api/reviews/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        const snapshot = await reviewsCollection.where('courseId', '==', courseId).get();
        const reviews = snapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = new Date(data.createdAt || Date.now());
            return {
                ...data,
                dateFormatted: createdAt.toLocaleDateString('uk-UA'),
            };
        });
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST: додати новий відгук
app.post('/api/reviews', async (req, res) => {
    const { courseId, author, text } = req.body;
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ error: 'Invalid courseId.' });
    }

    if (!text || text.length < 10 || text.length > 500) {
        return res.status(400).json({ error: 'Text must be between 10 and 500 characters.' });
    }

    try {
        const review = {
            courseId,
            author,
            text,
            createdAt: new Date().toISOString(),
        };
        await reviewsCollection.add(review);
        res.status(201).json({ message: 'Review added successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// GET: отримати всі курси
app.get('/api/courses', async (req, res) => {
    try {
        const snapshot = await coursesCollection.get();
        const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// GET: отримати розклад
app.get('/api/schedule', async (req, res) => {
    try {
        const snapshot = await scheduleCollection.get();
        const schedule = snapshot.docs.map(doc => doc.data());
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

// GET: прогрес користувача
app.get('/api/progress/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const docRef = usersCollection.doc(uid);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = docSnap.data();
        res.json({
            startedCourses: data.startedCourses || [],
            completedCourses: data.completedCourses || [],
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user progress' });
    }
});

// POST: створити або оновити користувача
app.post('/api/users', async (req, res) => {
    console.log("📥 POST /api/users → req.body:", req.body); // 🔍 лог

    const { uid, email, displayName } = req.body;
    if (!uid || !email) {
        return res.status(400).json({ error: 'uid and email are required' });
    }

    try {
        const userRef = usersCollection.doc(uid);
        const userData = { uid, email };
        if (displayName !== undefined) {
            userData.displayName = displayName;
        }
        await userRef.set(userData, { merge: true });
        res.status(200).json({ message: 'User saved successfully.' });
    } catch (err) {
        console.error("❌ Помилка при збереженні користувача:", err); // 🔥 лог помилки
        res.status(500).json({ error: 'Failed to save user' });
    }
});

// GET: отримати користувача за uid
app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userDoc.data());
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Хостинг статики (після білду клієнта)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
server.on('close', () => {
    console.log('❌ Server was closed');
});

// Утримує процес Node.js активним (тимчасово, поки не буде інших активних потоків)
process.stdin.resume();