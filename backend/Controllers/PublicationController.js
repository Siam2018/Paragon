import { Publication } from '../../frontend/models/publicationmodel.js';
export const createPublication = async (request, response) => {
    try {
        const { Title, Description } = request.body;
        if (!Title || !Description || !request.file) {
            return response.status(400).send({
                message: 'Send all required fields including image file.',
            });
        }
        const newPublication = {
            Title,
            Description,
            ImageURL: request.file.filename
        };
        const publication = await Publication.create(newPublication);
        return response.status(201).send(publication);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const getAllPublications = async (request, response) => {
    try {
        const publications = await Publication.find();
        return response.status(200).send(publications);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const getPublicationById = async (request, response) => {
    try {
        const { id } = request.params;
        const publication = await Publication.findById(id);
        return response.status(200).json(publication);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const updatePublication = async (request, response) => {
    try {
        const { Title, Description } = request.body;
        if (!Title || !Description) {
            return response.status(400).send({
                message: 'Send all required fields.',
            });
        }
        const { id } = request.params;
        let update = { Title, Description };
        if (request.file) {
            update.ImageURL = request.file.filename;
        }
        const updatedPublication = await Publication.findByIdAndUpdate(id, update, { new: true });
        if (!updatedPublication) {
            return response.status(404).send({ message: 'Publication not found.' });
        }
        return response.status(200).send({
            message: 'Publication updated successfully.',
            publication: updatedPublication
        });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const deletePublication = async (request, response) => {
    try {
        const { id } = request.params;
        const deletedPublication = await Publication.findByIdAndDelete(id);
        if (!deletedPublication) {
            return response.status(404).send({ message: 'Publication not found.' });
        }
        return response.status(200).json({
            message: 'Publication deleted successfully.',
            publication: deletedPublication
        });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};
