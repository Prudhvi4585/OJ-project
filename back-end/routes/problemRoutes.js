const express = require('express');
const router = express.Router();
const { getAllProblems, createProblem,updateProblem, deleteProblem, getProblemByTitle ,getFullProblemByTitle} = require('../controllers/problemController');


router.get('/getProblemByTitle/:title',getProblemByTitle);

router.get('/getAllProblems',getAllProblems);

router.post('/createProblem',createProblem);

router.put('/updateProblem',updateProblem);

router.delete('/deleteProblem',deleteProblem);

router.get('/getFullProblem/:title',getFullProblemByTitle);


module.exports = router;