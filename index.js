// after calling a function, it returns an object it is called factory function
const express = require('express');
const app = express();

const packages = require('./data/tour');

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/packages', (req, res) => {
    res.json(packages);
});

// use http://localhost:3000/packages in postman to get all the packages --------------------------------

app.get('/packages/:id', (req, res) => {
    const packageId = parseInt(req.params.id);
    const selectedPackage = packages.find(pkg => pkg.id === packageId); // comparing what id we put in postman with the id in the packages array, if true then it will return the package with that id
    res.json(selectedPackage);
});
// use http://localhost:3000/packages/1 in postman to get the package with id 1 here
// --------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});