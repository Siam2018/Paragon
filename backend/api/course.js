// Serverless API route for courses
import { dbConnect } from './_db.js';
import { Course } from '../../frontend/models/coursemodel.js';
import jwt from 'jsonwebtoken';

function requireAuth(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return null;
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
}

export default async function handler(req, res) {
  await dbConnect();
  // POST /Course (create)
  if (req.method === 'POST' && req.url.endsWith('/Course')) {
    if (requireAuth(req, res)) return;
    const { Title, Description, RegularClass, ClassTest, WeeklyReviewTest, MonthlyTest, ExclusiveTest, ModelTest, Price, ImageURL } = req.body;
    if (!Title || !Description) return res.status(400).json({ message: 'Title and Description are required.' });
    try {
      const newCourse = await Course.create({
        Title,
        Description,
        ImageURL: ImageURL || '', // In serverless, handle image upload via cloud storage
        RegularClass: parseInt(RegularClass) || 0,
        ClassTest: parseInt(ClassTest) || 0,
        WeeklyReviewTest: parseInt(WeeklyReviewTest) || 0,
        MonthlyTest: parseInt(MonthlyTest) || 0,
        ExclusiveTest: parseInt(ExclusiveTest) || 0,
        ModelTest: parseInt(ModelTest) || 0,
        Price: parseFloat(Price) || 0
      });
      return res.status(201).json(newCourse);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Course (all)
  else if (req.method === 'GET' && req.url.endsWith('/Course')) {
    try {
      const courses = await Course.find();
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Course/:id
  else if (req.method === 'GET' && /\/Course\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Course/')[1];
    try {
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: 'Course not found.' });
      return res.status(200).json(course);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Course/:id
  else if (req.method === 'PUT' && /\/Course\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Course/')[1];
    const { Title, Description, RegularClass, ClassTest, WeeklyReviewTest, MonthlyTest, ExclusiveTest, ModelTest, Price, ImageURL } = req.body;
    if (!Title || !Description) return res.status(400).json({ message: 'Title and Description are required.' });
    try {
      const updateData = {
        Title,
        Description,
        RegularClass: parseInt(RegularClass) || 0,
        ClassTest: parseInt(ClassTest) || 0,
        WeeklyReviewTest: parseInt(WeeklyReviewTest) || 0,
        MonthlyTest: parseInt(MonthlyTest) || 0,
        ExclusiveTest: parseInt(ExclusiveTest) || 0,
        ModelTest: parseInt(ModelTest) || 0,
        Price: parseFloat(Price) || 0
      };
      if (ImageURL) updateData.ImageURL = ImageURL;
      const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedCourse) return res.status(404).json({ message: 'Course not found.' });
      return res.status(200).json(updatedCourse);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // DELETE /Course/:id
  else if (req.method === 'DELETE' && /\/Course\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Course/')[1];
    try {
      const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) return res.status(404).json({ message: 'Course not found.' });
      return res.status(200).json({ message: 'Course deleted successfully.', course: deletedCourse });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
