import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
        // Personal Information
        BanglaName:{
            type: String,
            required: true,
        },
        EnglishName:{
            type: String,
            required: true,
        },
        FatherName:{
            type: String,
            required: true,
        },
        MotherName:{
            type: String,
            required: true,
        },
        DateOfBirth:{
            type: Date,
            required: true,
        },
        Gender:{
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Other']
        },
        ProfilePicture:{
            type: String,
            required: true,
        },

        // Contact Information
        ContactNumber:{
            type: String,
            required: true,
        },
        GuardianContactNumber:{
            type: String,
            required: true,
        },
        // Address Information
        PresentAddress:{
            type: String,
            required: true,
        },
        PermanentAddress:{
            type: String,
            required: true,
        },

        // Educational Information (SSC)
        SchoolName:{
            type: String,
            required: true,
        },
        SSCBoard:{
            type: String,
            required: true,
            enum: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']
        },
        SSCGroup:{
            type: String,
            required: true,
            enum: ['Science', 'Commerce', 'Arts']
        },
        SSCYearPass:{
            type: String,
            required: true,
            enum: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027',  '2028', '2029', '2030']
        },
        SSCGPA:{
            type: String,
            required: true,
        },
        SSCGrade:{
            type: String,
            required: true,
            enum: ['A+', 'A', 'A-','B', 'C', 'D']
        },
        SSCRollNumber:{
            type: String,
            required: true,
        },
        SSCRegistrationNumber:{
            type: String,
            required: true,
        },

        // Educational Information (HSC)
        CollegeName:{
            type: String,
            required: true,
        },
        HSCBoard:{
            type: String,
            enum: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']
        },
        HSCGroup:{
            type: String,
            required: true,
            enum: ['Science', 'Commerce', 'Arts']
        },
        HSCYearPass:{
            type: String,
            required: true,
            enum: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027',  '2028', '2029', '2030']
        },
        HSCGPA:{
            type: String,
        },
        HSCGrade:{
            type: String,
            enum: ['A+', 'A', 'A-','B', 'C', 'D']
        },
        HSCRollNumber:{
            type: String,
            required: true,
        },
        HSCRegistrationNumber:{
            type: String,
        },

        // Student Account Information & Course Selection
        SelectedCourse:{
            type: String,
            required: true,
        },
        BranchName:{
            type: String,
            required: true,
        },
        Email:{
            type: String,
            required: true,
            unique: true,
        },
        Password:{
            type: String,
            required: true,
        },
        Status:{
            type: String,
            default: "Active",
            enum: ['Active', 'Inactive']
        },
        Role:{
            type: String,
            default: "Student"
        },
        TermsAccepted:{
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;