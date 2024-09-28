const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

const JWT_SECRET = 'your_secret_key'; // Replace with your secret key

// Dummy user data with hashed passwords
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 8) // hashed password
    }
];

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).send('User not found');
    }

    // Check if the password is valid
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Expires in 1 hour
    return res.status(200).send({ auth: true, token });
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('No token provided.');
    }

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token.');
        }
        return res.status(200).send('This is a protected route.');
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
