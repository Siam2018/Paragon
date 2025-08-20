// Serverless API route for students
import { dbConnect } from './_db.js';
import { Student } from '../models/studentmodel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
  // POST /Student/register
  if (req.method === 'POST' && req.url.endsWith('/Student/register')) {
    // Validation should be done on frontend or add here if needed
    const requiredFields = [
      'BanglaName', 'EnglishName', 'FatherName', 'MotherName',
      'DateOfBirth', 'Gender', 'ContactNumber', 'PresentAddress', 'PermanentAddress',
      'SchoolName', 'SSCBoard', 'SSCGroup', 'SSCYearPass', 'SSCGPA', 'SSCGrade', 'SSCRollNumber', 'SSCRegistrationNumber',
      'CollegeName', 'HSCGroup', 'HSCYearPass', 'HSCRollNumber',
      'SelectedCourse', 'BranchName', 'Email', 'Password'
    ];
    for (let field of requiredFields) {
      if (!req.body[field]) return res.status(400).json({ message: `${field} is required.` });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.Email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    const existingStudent = await Student.findOne({ Email: req.body.Email });
    if (existingStudent) return res.status(400).json({ message: 'Email already exists.' });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);
    const newStudent = {
      BanglaName: req.body.BanglaName,
      EnglishName: req.body.EnglishName,
      FatherName: req.body.FatherName,
      MotherName: req.body.MotherName,
      DateOfBirth: new Date(req.body.DateOfBirth),
      Gender: req.body.Gender,
      ProfilePicture: req.body.ProfilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      ContactNumber: req.body.ContactNumber,
      GuardianContactNumber: req.body.GuardianContactNumber || '',
      PresentAddress: req.body.PresentAddress,
      PermanentAddress: req.body.PermanentAddress,
      SchoolName: req.body.SchoolName,
      SSCBoard: req.body.SSCBoard,
      SSCGroup: req.body.SSCGroup,
      SSCYearPass: req.body.SSCYearPass,
      SSCGPA: req.body.SSCGPA,
      SSCGrade: req.body.SSCGrade,
      SSCRollNumber: req.body.SSCRollNumber,
      SSCRegistrationNumber: req.body.SSCRegistrationNumber,
      CollegeName: req.body.CollegeName,
      HSCBoard: req.body.HSCBoard || '',
      HSCGroup: req.body.HSCGroup,
      HSCYearPass: req.body.HSCYearPass,
      HSCGPA: req.body.HSCGPA || '',
      HSCGrade: req.body.HSCGrade || '',
      HSCRollNumber: req.body.HSCRollNumber,
      HSCRegistrationNumber: req.body.HSCRegistrationNumber || '',
      SelectedCourse: req.body.SelectedCourse,
      BranchName: req.body.BranchName,
      Email: req.body.Email,
      Password: hashedPassword,
      TermsAccepted: req.body.TermsAccepted || false,
      Status: "Active",
      Role: "Student"
    };
    try {
      const student = await Student.create(newStudent);
      return res.status(201).json(student);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // POST /Student/login
  else if (req.method === 'POST' && req.url.endsWith('/Student/login')) {
    const { Email, Password } = req.body;
    if (!Email || !Password) return res.status(400).json({ message: 'Email and Password are required.' });
    try {
      const student = await Student.findOne({ Email });
      if (!student) return res.status(401).json({ message: 'Invalid email or password.' });
      let passwordMatch = false;
      try { passwordMatch = await bcrypt.compare(Password, student.Password); } catch { passwordMatch = false; }
      if (!passwordMatch) passwordMatch = (student.Password === Password);
      if (!passwordMatch) return res.status(401).json({ message: 'Invalid email or password.' });
      if (student.Status !== "Active") return res.status(401).json({ message: 'Account is not active.' });
      const studentData = student.toObject();
      delete studentData.Password;
      const token = jwt.sign({ id: student._id, Email: student.Email, type: 'student' }, process.env.JWT_SECRET, { expiresIn: "12h" });
      return res.status(200).json({ message: 'Login successful.', token, student: studentData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Student/public (all students, no auth)
  else if (req.method === 'GET' && req.url.endsWith('/Student/public')) {
    try {
      const students = await Student.find().select('-Password');
      return res.status(200).json(students);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Admin/Student/ (all students, admin auth)
  else if (req.method === 'GET' && req.url.endsWith('/Admin/Student/')) {
    if (requireAuth(req, res)) return;
    try {
      const students = await Student.find().select('-Password');
      return res.status(200).json(students);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // GET /Admin/Student/:id
  else if (req.method === 'GET' && /\/Admin\/Student\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Admin/Student/')[1];
    try {
      const student = await Student.findById(id).select('-Password');
      if (!student) return res.status(404).json({ message: 'Student not found.' });
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Admin/Student/:id (update student)
  else if (req.method === 'PUT' && /\/Admin\/Student\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Admin/Student/')[1];
    const updateData = { ...req.body };
    if (!updateData.Password) delete updateData.Password;
    try {
      const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true }).select('-Password');
      if (!updatedStudent) return res.status(404).json({ message: 'Student not found.' });
      return res.status(200).json(updatedStudent);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // PUT /Admin/Student/password/:id (update password)
  else if (req.method === 'PUT' && /\/Admin\/Student\/password\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Admin/Student/password/')[1];
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current password and new password are required.' });
    try {
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: 'Student not found.' });
      let currentPasswordMatch = false;
      try { currentPasswordMatch = await bcrypt.compare(currentPassword, student.Password); } catch { currentPasswordMatch = false; }
      if (!currentPasswordMatch) currentPasswordMatch = (student.Password === currentPassword);
      if (!currentPasswordMatch) return res.status(401).json({ message: 'Current password is incorrect.' });
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      student.Password = hashedNewPassword;
      await student.save();
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // DELETE /Admin/Student/:id
  else if (req.method === 'DELETE' && /\/Admin\/Student\/.+/.test(req.url)) {
    if (requireAuth(req, res)) return;
    const id = req.url.split('/Admin/Student/')[1];
    try {
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) return res.status(404).json({ message: 'Student not found.' });
      return res.status(200).json({ message: 'Student deleted successfully.', student: deletedStudent });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  else {
    res.status(404).json({ message: 'Not found' });
  }
}
