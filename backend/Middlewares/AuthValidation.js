import Joi from 'joi';

const adminRegisterValidation = (request, response, next) => {
    const schema = Joi.object({
        FullName: Joi.string().min(3).max(30).required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().min(8).required()

    });
    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).send({message: error.message});
    }
    next();
}

const adminSigninValidation = (request, response, next) => {
    const schema = Joi.object({
        Email: Joi.string().email().required(),
        Password: Joi.string().min(8).required()
    });

    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).send({message: error.message});
    }
    next();
}

const studentRegisterValidation = (request, response, next) => {
    const schema = Joi.object({
        // Personal Information
        BanglaName: Joi.string().min(2).max(50).required(),
        EnglishName: Joi.string().min(2).max(50).required(),
        FatherName: Joi.string().min(2).max(50).required(),
        MotherName: Joi.string().min(2).max(50).required(),
        DateOfBirth: Joi.date().required(),
        Gender: Joi.string().valid('Male', 'Female', 'Other').required(),
        
        // Contact Information
        ContactNumber: Joi.string().min(10).max(15).required(),
        GuardianContactNumber: Joi.string().allow(''),
        
        // Address Information
        PresentAddress: Joi.string().required(),
        PermanentAddress: Joi.string().required(),
        
        // Educational Information (SSC)
        SchoolName: Joi.string().required(),
        SSCBoard: Joi.string().valid('Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh').required(),
        SSCGroup: Joi.string().valid('Science', 'Commerce', 'Arts').required(),
        SSCYearPass: Joi.string().valid('2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030').required(),
        SSCGPA: Joi.string().required(),
        SSCGrade: Joi.string().valid('A+', 'A', 'A-', 'B', 'C', 'D').required(),
        SSCRollNumber: Joi.string().required(),
        SSCRegistrationNumber: Joi.string().required(),
        
        // Educational Information (HSC)
        CollegeName: Joi.string().required(),
        HSCBoard: Joi.string().valid('Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh').allow(''),
        HSCGroup: Joi.string().valid('Science', 'Commerce', 'Arts').required(),
        HSCYearPass: Joi.string().valid('2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030').required(),
        HSCGPA: Joi.string().allow(''),
        HSCGrade: Joi.string().valid('A+', 'A', 'A-', 'B', 'C', 'D').allow(''),
        HSCRollNumber: Joi.string().required(),
        HSCRegistrationNumber: Joi.string().allow(''),
        
        // Course Selection
        SelectedCourse: Joi.string().required(),
        BranchName: Joi.string().required(),
        
        // Account Information
        Email: Joi.string().email().required(),
        Password: Joi.string().min(6).required(),
        TermsAccepted: Joi.boolean().valid(true).required()
    });

    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).send({message: error.message});
    }
    next();
}

const studentSigninValidation = (request, response, next) => {
    const schema = Joi.object({
        Email: Joi.string().email().required(),
        Password: Joi.string().min(6).required()
    });

    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).send({message: error.message});
    }
    next();
}

export default { 
    adminRegisterValidation, 
    adminSigninValidation, 
    studentRegisterValidation, 
    studentSigninValidation 
};