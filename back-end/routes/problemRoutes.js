const express = require('express');
const router = express.Router();
const { getAllProblems, createProblem,updateProblem, deleteProblem, getProblemByTitle } = require('../controllers/problemController');


router.get('/getProblemByTitle/:title',getProblemByTitle);

router.get('/getAllProblems',getAllProblems);

router.post('/createProblem',createProblem);

router.put('/updateProblem',updateProblem);

router.delete('/deleteProblem',deleteProblem);


module.exports = router;