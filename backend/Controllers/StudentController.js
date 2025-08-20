import { Student } from "../../frontend/models/studentmodel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const StudentController = {
    createStudent: async (request, response) => {
        try {
            console.log('Request body:', request.body);
            
            const requiredFields = [
                'BanglaName', 'EnglishName', 'FatherName', 'MotherName',
                'DateOfBirth', 'Gender', 'ContactNumber', 'PresentAddress', 'PermanentAddress',
                'SchoolName', 'SSCBoard', 'SSCGroup', 'SSCYearPass', 'SSCGPA', 'SSCGrade', 'SSCRollNumber', 'SSCRegistrationNumber',
                'CollegeName', 'HSCGroup', 'HSCYearPass', 'HSCRollNumber',
                'SelectedCourse', 'BranchName', 'Email', 'Password'
            ];

            for (let field of requiredFields) {
                if (!request.body[field]) {
                    return response.status(400).send({
                        message: `${field} is required.`,
                    });
                }
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(request.body.Email)) {
                return response.status(400).send({
                    message: 'Please enter a valid email address.',
                });
            }
            
            // Check if email already exists
            const existingStudent = await Student.findOne({ Email: request.body.Email });
            if (existingStudent) {
                return response.status(400).send({
                    message: 'Email already exists.',
                });
            }
            
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(request.body.Password, saltRounds);
            
            const newStudent = {
                // Personal Information
                BanglaName: request.body.BanglaName,
                EnglishName: request.body.EnglishName,
                FatherName: request.body.FatherName,
                MotherName: request.body.MotherName,
                DateOfBirth: new Date(request.body.DateOfBirth),
                Gender: request.body.Gender,
                ProfilePicture: request.body.ProfilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                
                // Contact Information
                ContactNumber: request.body.ContactNumber,
                GuardianContactNumber: request.body.GuardianContactNumber || '',
                
                // Address Information
                PresentAddress: request.body.PresentAddress,
                PermanentAddress: request.body.PermanentAddress,
                
                // Educational Information (SSC)
                SchoolName: request.body.SchoolName,
                SSCBoard: request.body.SSCBoard,
                SSCGroup: request.body.SSCGroup,
                SSCYearPass: request.body.SSCYearPass,
                SSCGPA: request.body.SSCGPA,
                SSCGrade: request.body.SSCGrade,
                SSCRollNumber: request.body.SSCRollNumber,
                SSCRegistrationNumber: request.body.SSCRegistrationNumber,
                
                // Educational Information (HSC)
                CollegeName: request.body.CollegeName,
                HSCBoard: request.body.HSCBoard || '',
                HSCGroup: request.body.HSCGroup,
                HSCYearPass: request.body.HSCYearPass,
                HSCGPA: request.body.HSCGPA || '',
                HSCGrade: request.body.HSCGrade || '',
                HSCRollNumber: request.body.HSCRollNumber,
                HSCRegistrationNumber: request.body.HSCRegistrationNumber || '',
                
                // Student Account Information & Course Selection
                SelectedCourse: request.body.SelectedCourse,
                BranchName: request.body.BranchName,
                Email: request.body.Email,
                Password: hashedPassword,
                TermsAccepted: request.body.TermsAccepted || false,
                Status: "Active",
                Role: "Student"
            };
            
            const student = await Student.create(newStudent);
            return response.status(201).send(student);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getAllStudents: async (request, response) => {
        try {
            const students = await Student.find().select('-Password');
            return response.status(200).send(students);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getStudentById: async (request, response) => {
        try {
            const { id } = request.params;
            const student = await Student.findById(id).select('-Password');
            if (!student) {
                return response.status(404).send({ message: 'Student not found.' });
            }
            return response.status(200).json(student);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateStudent: async (request, response) => {
        try {
            const { id } = request.params;
            
            // Remove password from update if not provided
            const updateData = { ...request.body };
            if (!updateData.Password) {
                delete updateData.Password;
            }
            
            const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true }).select('-Password');
            if (!updatedStudent) {
                return response.status(404).send({ message: 'Student not found.' });
            }
            return response.status(200).send(updatedStudent);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateStudentPassword: async (request, response) => {
        try {
            const { id } = request.params;
            const { currentPassword, newPassword } = request.body;
            
            if (!currentPassword || !newPassword) {
                return response.status(400).send({
                    message: 'Current password and new password are required.',
                });
            }
            
            // Find student with password
            const student = await Student.findById(id);
            if (!student) {
                return response.status(404).send({ message: 'Student not found.' });
            }
            
            // Verify current password - handle both hashed and plain text passwords
            let currentPasswordMatch = false;
            
            // First try bcrypt compare (for hashed passwords)
            try {
                currentPasswordMatch = await bcrypt.compare(currentPassword, student.Password);
            } catch (error) {
                // If bcrypt compare fails, it might be a plain text password
                currentPasswordMatch = false;
            }
            
            // If bcrypt compare failed, try plain text comparison (for old passwords)
            if (!currentPasswordMatch) {
                currentPasswordMatch = (student.Password === currentPassword);
            }
            
            if (!currentPasswordMatch) {
                return response.status(401).send({
                    message: 'Current password is incorrect.',
                });
            }
            
            // Hash the new password
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
            
            // Update password with hashed version
            student.Password = hashedNewPassword;
            await student.save();
            
            return response.status(200).send({
                message: 'Password updated successfully.',
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateStudentPhoto: async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!request.file) {
                return response.status(400).send({
                    message: 'No photo file uploaded.',
                });
            }
            
            // Find student
            const student = await Student.findById(id);
            if (!student) {
                return response.status(404).send({ message: 'Student not found.' });
            }
            
            // Update profile picture path
            const photoPath = `/uploads/students/${request.file.filename}`;
            student.ProfilePicture = photoPath;
            await student.save();
            
            const updatedStudent = student.toObject();
            delete updatedStudent.Password;
            
            return response.status(200).send({
                message: 'Photo updated successfully.',
                student: updatedStudent
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    deleteStudent: async (request, response) => {
        try {
            const { id } = request.params;
            const deletedStudent = await Student.findByIdAndDelete(id);
            if (!deletedStudent) {
                return response.status(404).send({ message: 'Student not found.' });
            }
            return response.status(200).json({
                message: 'Student deleted successfully.',
                student: deletedStudent
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    loginStudent: async (request, response) => {
        try {
            const { Email, Password } = request.body;
            
            if (!Email || !Password) {
                return response.status(400).send({
                    message: 'Email and Password are required.',
                });
            }
            
            const student = await Student.findOne({ Email });
            if (!student) {
                return response.status(401).send({
                    message: 'Invalid email or password.',
                });
            }
            
            // Check password - handle both hashed and plain text passwords
            let passwordMatch = false;
            
            // First try bcrypt compare (for passwords reset via forgot password)
            try {
                passwordMatch = await bcrypt.compare(Password, student.Password);
            } catch (error) {
                // If bcrypt compare fails, it might be a plain text password
                passwordMatch = false;
            }
            
            // If bcrypt compare failed, try plain text comparison (for old registrations)
            if (!passwordMatch) {
                passwordMatch = (student.Password === Password);
            }
            
            if (!passwordMatch) {
                return response.status(401).send({
                    message: 'Invalid email or password.',
                });
            }
            
            if (student.Status !== "Active") {
                return response.status(401).send({
                    message: 'Account is not active.',
                });
            }
            
            const studentData = student.toObject();
            delete studentData.Password;
            
            // Generate JWT token for student
            const token = jwt.sign(
                { 
                    id: student._id, 
                    Email: student.Email, 
                    type: 'student' 
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: "12h" }
            );
            
            return response.status(200).send({
                message: 'Login successful.',
                token,
                student: studentData
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    }
};

export default StudentController;
