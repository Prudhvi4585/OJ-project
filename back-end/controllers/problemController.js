
const Problem = require('../models/Problem');


exports.getProblemByTitle = async (req, res) => {
    const problem = await Problem.findOne({ title: req.params.title });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found!' });
    }
    res.status(200).json(problem);
  };
  
exports.getAllProblems = async (req, res) => {
  const problems = await Problem.find({}, 'title difficulty'); // only select title and difficulty
  res.status(200).json(problems);
};

exports.createProblem = async (req, res) => {
  try {
    const { title, statement, constraints, difficulty, testcases } = req.body;

    // Check if a problem with the same title already exists
    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(409).json({ message: 'Problem already exists!' });
    }

    // If not, create a new problem
    const problem = await Problem.create({
      title,
      statement,
      constraints,
      difficulty,
      testcases,
    });

    return res.status(201).json(problem);
  } catch (error) {
    console.error('Error while creating problem:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



//  things to do 
//  front front end send like oldtitle , newtitle and accordingly use it in update
exports.updateProblem = async (req, res) => {
  try {
    const { oldtitle,newtitle, statement, constraints, difficulty, testcases } = req.body;

    // Check if a problem with the same title already exists
    const existingProblem = await Problem.findOne({ newtitle });
    if (existingProblem) {
      return res.status(409).json({ message: 'Problem title already exists!' });
    }

    // Update the existing problem
    const updatedProblem = await Problem.findOneAndUpdate(
      { title: oldtitle },
      {
        title: newtitle,
        statement,
        constraints,
        difficulty,
        testcases,
      },
      { new: true }
    );

    return res.status(200).json(updatedProblem);
  } catch (error) {
    console.error('Error while updating problem:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.deleteProblem = async (req, res) => {
  try {
    console.log(req.body);
    const { title } = req.body;

    // Check if a problem with the same title already exists
    const existingProblem = await Problem.findOne({ title });
    if (!existingProblem) {
      return res.status(404).json({ message: 'Problem not found!' });
    }

    // Delete the existing problem
    const deletedProblem = await Problem.findOneAndDelete({ title });

    return res.status(200).json(deletedProblem);
  } catch (error) {
    console.error('Error while deleting problem:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



