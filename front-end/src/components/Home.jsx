import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/problems/getAllProblems');
        setProblems(res.data);
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">All Problems</h1>
      {problems.map((problem, index) => (
        <div
          key={index}
          className="bg-gray-800 text-white rounded-xl shadow-md mb-4 p-6 w-full max-w-screen-md mx-auto transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-700"
        >
          <div className="flex items-center justify-between">
            <Link
              to={`/problem/${problem.title}`}
              className="text-xl font-semibold text-blue-400 hover:underline"
            >
              {problem.title}
            </Link>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
              problem.difficulty === 'easy' ? 'bg-green-500 text-white' :
              problem.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-red-500 text-white'
            }`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;