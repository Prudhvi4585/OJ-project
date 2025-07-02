import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Problem = () => {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50); // percentage

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/problems/getProblemByTitle/${title}`);
        setProblem(res.data);
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };
    fetchProblem();
  }, [title]);

  const handleDrag = (e) => {
    if (isDragging) {
      const percentage = (e.clientX / window.innerWidth) * 100;
      setDividerPosition(Math.max(20, Math.min(80, percentage)));
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const runCode = () => {
    setOutput('Sample output here...');
    setVerdict('✔️ Passed');
  };

  const submitCode = () => {
    setOutput('Final output...');
    setVerdict('✅ All Testcases Passed');
  };

  return (
    <div
      className="min-h-screen dark:bg-gray-900 flex"
      onMouseMove={handleDrag}
      onMouseUp={handleMouseUp}
    >
      {/* Left - Problem Statement */}
      <div
        className="p-8 overflow-auto bg-white dark:bg-gray-800 shadow-lg"
        style={{ width: `${dividerPosition}%`, minWidth: '250px' }}
      >
        {problem ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{problem.title}</h1>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                  problem.difficulty === 'easy'
                    ? 'bg-green-100 text-green-800 dark:bg-green-200'
                    : problem.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-200'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">📝 Statement</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{problem.statement}</p>
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-600" />

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">📌 Constraints</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{problem.constraints}</p>
            </div>

            {/* Test Cases (only first two) */}
            {problem.testcases?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">🧪 Sample Testcases</h2>
                {problem.testcases.slice(0, 2).map((testcase, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <p className="font-semibold">Testcase {idx + 1}</p>
                    <p><span className="font-medium">Input:</span> {testcase.input}</p>
                    <p><span className="font-medium">Expected Output:</span> {testcase.output}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-white">Loading problem...</p>
        )}
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="w-2 cursor-col-resize bg-gray-300 dark:bg-gray-700"
      />

      {/* Right - Code Editor */}
      <div className="p-6 flex-1 dark:bg-gray-900">
        {/* Language Dropdown */}
        <div className="mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        {/* Code Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={18}
          placeholder="Write your code here..."
          className="w-full p-4 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-900 dark:text-white font-mono"
        />

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={runCode}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Run
          </button>
          <button
            onClick={submitCode}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Submit
          </button>
        </div>

        {/* Output */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Output:</h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-gray-800 dark:text-gray-100 whitespace-pre-line">
            {output}
          </div>
          <p className="mt-2 text-green-500 dark:text-green-400 font-medium">{verdict}</p>
        </div>

        {/* Output for Sample Testcases */}
        {problem?.testcases?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">🧾 Output for Sample Testcases:</h3>
            {problem.testcases.slice(0, 2).map((testcase, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <p className="font-semibold">Testcase {idx + 1}</p>
                <p><span className="font-medium">Input:</span> {testcase.input}</p>
                <p><span className="font-medium">Your Output:</span> {output || '---'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problem;
