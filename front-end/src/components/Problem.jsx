import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Problem = () => {
  const { title } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50);

  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintContent, setHintContent] = useState('');

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

  const runCode = async () => {
    setIsLoading(true);
    setError('');
    setVerdict('');
    setOutput('');
    setTestResults([]);
    try {
      const res = await axios.post('http://localhost:5000/run', {
        code,
        language,
        input: customInput
      });
      setOutput(res.data.output);
      setVerdict('✔️ Custom input executed');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while running your code');
    }
    setIsLoading(false);
  };

  const submitCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');
    setVerdict('');
    setTestResults([]);
    try {
      const res = await axios.post('http://localhost:5000/submit', {
        code,
        language,
        problemTitle: problem.title
      });

      const { summary, results } = res.data;
      setVerdict(`✅ ${summary.passed}/${summary.total} Testcases Passed`);
      setTestResults(results);

      const firstErrorIndex = results.findIndex(r => r.verdict === 'Error');
      const firstFailIndex = results.findIndex(r => r.verdict === 'Failed');

      if (firstErrorIndex === -1 && firstFailIndex === -1) {
        setError('');
      } else if (firstErrorIndex === -1) {
        setError(`❌ Wrong Answer on Testcase ${firstFailIndex + 1}`);
      } else if (firstFailIndex === -1) {
        setError(`❌ Runtime Error on Testcase ${firstErrorIndex + 1}`);
      } else {
        if (firstFailIndex < firstErrorIndex) {
          setError(`❌ Wrong Answer on Testcase ${firstFailIndex + 1}`);
        } else {
          setError(`❌ Runtime Error on Testcase ${firstErrorIndex + 1}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while submitting your code');
    }
    setIsLoading(false);
  };

  const generateHints = async () => {
    setIsHintLoading(true);
    setHintContent('');
    try {
      const res = await axios.post('http://localhost:5000/ai-hints', {
        problem,
        code
      });
      setHintContent(res.data.airesponce || 'No hints returned.');
    } catch (err) {
      setHintContent('❌ Failed to generate hints. Try again.');
    }
    setIsHintLoading(false);
  };

  return (
    <div
      className="min-h-screen dark:bg-gray-900 flex"
      onMouseMove={handleDrag}
      onMouseUp={handleMouseUp}
    >
      {/* Left Panel */}
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

            {/* Sample Test Cases */}
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

            {/* Hints Generator Button */}
            <div className="mt-6">
              <button
                onClick={generateHints}
                disabled={isHintLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  isHintLoading ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isHintLoading ? 'Generating Hints...' : '💡 Generate Hints'}
              </button>
            </div>

            {/* Hints Section */}
            {hintContent && (
              <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">🧠 Hints</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{hintContent}</ReactMarkdown>
                </div>
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

      {/* Right Panel */}
      <div className="p-6 flex-1 dark:bg-gray-900">
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

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={18}
          placeholder="Write your code here..."
          className="w-full p-4 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-900 dark:text-white font-mono"
        />

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

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">🧾 Custom Input:</h3>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={4}
            placeholder="Enter your custom input here..."
            className="w-full p-3 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-white font-mono"
          />
        </div>

        {isLoading && (
          <p className="mt-4 text-blue-500 dark:text-blue-300 font-semibold">⏳ Running your code...</p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Output:</h3>

          {verdict && (
            <p className="text-green-500 dark:text-green-400 font-medium">{verdict}</p>
          )}

          {output && (
            <div className="mt-2 p-4 rounded bg-gray-800 text-white font-mono whitespace-pre-wrap">
              {output}
            </div>
          )}

          {error && (
            <p className="mt-2 text-red-500 dark:text-red-400 font-medium">{error}</p>
          )}

          {testResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded text-white font-mono ${
                    result.verdict === 'Passed'
                      ? 'bg-green-600'
                      : result.verdict === 'Failed'
                      ? 'bg-red-600'
                      : 'bg-yellow-600'
                  }`}
                >
                  Testcase {idx + 1}: {result.verdict}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problem;
