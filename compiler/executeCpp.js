const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // helps create instance of the terminal and helps in executing commmands



const outputPath = path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath))
{
    fs.mkdirSync(outputPath, {recursive: true});
}


const executeCpp = async (filePath)=>{
    
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.exe`;
    const outPath = path.join(outputPath,`${jobId}.exe`);


    
    const command = `g++ "${filePath}" -o "${outPath}" && cd "${outputPath}" && ${outputFilename}`;


    return new Promise((resolve,reject)=>{
        exec(command, (error, stdout, stderr) => {
            
            // development work error will be picked up by error obj
            // if error arises when command is executed then it is picked up by the stderr
            // if no error is found after command is executed then it is picked up by the stdout
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        });
    })

}

module.exports = executeCpp;