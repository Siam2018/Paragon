import jwt from 'jsonwebtoken';


const auth = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        return response.status(401).send({ message: 'Access denied. No token provided.' });
    }
    // Expecting format: 'Bearer <token>'
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return response.status(401).send({ message: 'Access denied. Invalid token format.' });
    }
    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return response.status(400).send({ message: 'Invalid token.' });
    }
}

export default auth;