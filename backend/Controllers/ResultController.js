import { Result } from "../models/resultmodel.js";
const ResultController = {
    createResult: async (request, response) => {
        try {
            console.log('Request body:', request.body);
            console.log('Request file:', request.file);
            
            if (!request.file) {
                return response.status(400).send({ message: 'Image file is required.' });
            }
            
            const newResult = {
                Title: request.body.Title || '',
                Description: request.body.Description || '',
                ImageURL: request.file.filename
            };
            
            const result = await Result.create(newResult);
            return response.status(201).send(result);
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getAllResults: async (request, response) => {
        try {
            const results = await Result.find();
            return response.status(200).send(results);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getResultById: async (request, response) => {
        try {
            const { id } = request.params;
            const result = await Result.findById(id);
            return response.status(200).json(result);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateResult: async (request, response) => {
        try {
            console.log('Update request body:', request.body);
            console.log('Update request file:', request.file);
            
            const { id } = request.params;
            let update = {
                Title: request.body.Title || '',
                Description: request.body.Description || ''
            };
            
            if (request.file) {
                update.ImageURL = request.file.filename;
            }
            
            const updatedResult = await Result.findByIdAndUpdate(id, update, { new: true });
            if (!updatedResult) {
                return response.status(404).send({ message: 'Result not found.' });
            }
            return response.status(200).send(updatedResult);
        } catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    deleteResult: async (request, response) => {
        try {
            const { id } = request.params;
            const deletedResult = await Result.findByIdAndDelete(id);
            if (!deletedResult) {
                return response.status(404).send({ message: 'Result not found.' });
            }
            return response.status(200).json({
                message: 'Result deleted successfully.',
                result: deletedResult
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    }
};

export default ResultController;
