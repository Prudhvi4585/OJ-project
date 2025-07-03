const express = require('express');
const axios = require('axios');
const generateFile = require('./generateFile');
const executeCpp = require('./executeCpp');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🎯 POST /submit
app.post('/submit', async (req, res) => {
  const { code, language = 'cpp', problemTitle } = req.body;

  if (!code || !problemTitle) {
    return res.status(400).json({ message: 'Code and Problem Title are required' });
  }

  try {
    // 1️⃣ Fetch problem from backend
    const response = await axios.get(`http://localhost:3000/api/v1/problems/getFullProblem/${problemTitle}`, {
  headers: {
    'x-compiler-secret': process.env.COMPILER_SECRET
  }
});
    const problem = response.data;

    console.log(problem);

    // 2️⃣ Generate file and run on each testcase
    const filePath = generateFile(language, code);

    console.log(filePath);

    
    const results = [];
    let passCount = 0, failCount = 0;

    for (const testcase of problem.testcases) {
      try {
        const output = await executeCpp(filePath, testcase.input);
        const trimmedOutput = output.trim();
        const expected = testcase.output.trim();
        const verdict = trimmedOutput === expected ? 'Passed' : 'Failed';

        if (verdict === 'Passed') passCount++;
        else failCount++;

        results.push({
        //   input: testcase.input,
        //   expectedOutput: expected,
        //   receivedOutput: trimmedOutput,
          verdict
        });
      } catch (err) {
        failCount++;
        results.push({
        //   input: testcase.input,
        //   expectedOutput: testcase.output,
          // receivedOutput: err.toString(),
          verdict: 'Error'
        });
      }
    }

    res.status(200).json({
      results,
      summary: {
        total: results.length,
        passed: passCount,
        failed: failCount
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching problem or executing code' });
  }
});


// 🎯 POST /run
app.post('/run', async (req, res) => {
  const { code, language = 'cpp', input = '' } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    // 1️⃣ Generate file
    const filePath = generateFile(language, code);

    // 2️⃣ Execute with custom input
    try {
      const output = await executeCpp(filePath, input);
      res.status(200).json({ output: output.trim() });
    } catch (err) {
      res.status(200).json({ output: `Error: ${err.toString()}` });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during execution' });
  }
});







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚙️ Compiler service running at http://localhost:${PORT}`));
