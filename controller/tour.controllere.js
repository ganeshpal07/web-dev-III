const tourModel = require('../model/tourModel')

// Get all tours
const getAllTours = (req, res) => {
    const tours = tourModel.getAll();
    res.json(tours);
}

// Get a single tour by ID
const getTourById = (req, res) => {
    const tour = tourModel.getById(req.params.id);
    if (!tour) {
        return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(tour);
}

const deleteTourById = (req, res) => {
    const id = parseInt(req.params.id);
    const result = tourModel.deleteTour(id);
    if (!result) {
        return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({ message: 'Tour deleted successfully' });
}

const getTourByQuery = (req, res) => {
    const query = req.query.name;
    const tours = tourModel.getByquery(query);
    res.json(tours);
}


const saveTour = (req, res) => {
    const tour = req.body;
    tourModel.saveTour(tour);
    res.status(201).send.json({ message: 'Tour saved successfully' });
}

const updateTour = (req, res) => {
    const id = req.params.id;
    const updatedTour = req.body;
    tourModel.updateTour(id, updatedTour);
    res.json({ message: 'Tour updated successfully' });
}

module.exports = {
    getAllTours,
    getTourById,
    getTourByQuery,
    saveTour,
    updateTour
};