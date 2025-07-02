// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// const outputPath = path.join(__dirname, 'outputs');
// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = async (filePath, input = "") => {
//     const jobId = path.basename(filePath).split('.')[0];
//     const outPath = path.join(outputPath, `${jobId}.exe`);

//     const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}"`;

//     return new Promise((resolve, reject) => {
//         exec(command, { input }, (error, stdout, stderr) => {
//             if (error || stderr) return reject(error || stderr);
//             resolve(stdout);
//         });
//     });
// };

// module.exports = executeCpp;
const fs = require('fs');
const path = require('path');
const { exec, execFile } = require('child_process');

const outputPath = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, input = "") => {
  const jobId = path.basename(filePath).split('.')[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  const compileCommand = `g++ "${filePath}" -o "${outPath}"`;

  return new Promise((resolve, reject) => {
    // 🔧 Step 1: Compile the code
    exec(compileCommand, (compileErr, stdout, stderr) => {
      if (compileErr || stderr) {
        return reject(compileErr || stderr);
      }

      // 🚀 Step 2: Run the compiled program
      const runProcess = execFile(outPath, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
        if (runErr || runStderr) {
          return reject(runErr || runStderr);
        }
        resolve(runStdout);
      });

      // 🔌 Send input to the program
      if (input) {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
      }
    });
  });
};

module.exports = executeCpp;

