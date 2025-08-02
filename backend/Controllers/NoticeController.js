import { Notice } from "../models/noticemodel.js";

const NoticeController = {
    createNotice: async (request, response) => {
        try {
            console.log('Request body:', request.body);
            console.log('Request file:', request.file);
            
            if (!request.body.Title || !request.body.Description) {
                return response.status(400).send({
                    message: 'Title and Description are required.',
                });
            }
            
            const pdfUrl = request.file ? request.file.filename : null;
            
            const newNotice = {
                Title: request.body.Title,
                Description: request.body.Description,
                PDFURL: pdfUrl,
            };
            
            const notice = await Notice.create(newNotice);
            return response.status(201).send(notice);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getAllNotices: async (request, response) => {
        try {
            const notices = await Notice.find();
            return response.status(200).send(notices);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getNoticeById: async (request, response) => {
        try {
            const { id } = request.params;
            const notice = await Notice.findById(id);
            return response.status(200).json(notice);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateNotice: async (request, response) => {
        try {
            console.log('Update request body:', request.body);
            console.log('Update request file:', request.file);
            
            if (!request.body.Title || !request.body.Description) {
                return response.status(400).send({
                    message: 'Title and Description are required.',
                });
            }
            
            const { id } = request.params;
            const updateData = {
                Title: request.body.Title,
                Description: request.body.Description,
            };
            
            if (request.file) {
                updateData.PDFURL = request.file.filename;
            }
            
            const updatedNotice = await Notice.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedNotice) {
                return response.status(404).send({ message: 'Notice not found.' });
            }
            return response.status(200).send(updatedNotice);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    deleteNotice: async (request, response) => {
        try {
            const { id } = request.params;
            const deletedNotice = await Notice.findByIdAndDelete(id);
            if (!deletedNotice) {
                return response.status(404).send({ message: 'Notice not found.' });
            }
            return response.status(200).json({
                message: 'Notice deleted successfully.',
                notice: deletedNotice
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    }
};

export default NoticeController;
