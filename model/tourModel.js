const fs = require('fs');
const path = require('path');
const toursFilePath = path.join(__dirname, '../data/tours.json');

const getAllTours = () => {
  const toursData = fs.readFileSync(toursFilePath, 'utf-8');
  return JSON.parse(toursData);
};

const getTourById = (id) => {
  const toursData = getAllTours();
  return toursData.find(tour => tour.id === id);
}

module.exports = {
  getAllTours,
  getTourById
};