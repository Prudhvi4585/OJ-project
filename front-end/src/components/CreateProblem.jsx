import React, { useState } from 'react';
import { useForm, useFieldArray, set } from 'react-hook-form';
import axios from 'axios';

const CreateProblem = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testcases',
  });

  const [newProblem, setNewProblem] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data) => {
    console.log(data);

    setNewProblem(true);
    setSuccessMessage('');
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/problems/createProblem`, data);
      console.log(res);
      setSuccessMessage('✅ New problem created successfully!');
      reset();

    }
    catch(err){
      console.log(err);
      if (err.response?.status === 409) {
        setNewProblem(false); // Title already exists
      } else {
        alert("Something went wrong!");
      }
    }

  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create a Problem</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            {successMessage && <p className="text-green-600 font-semibold mb-2">{successMessage}</p>}
            {(!newProblem) && <p className ='text-red-500 text-sm'>title already exists</p>}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
              <input
                id="title"
                {...register('title', { required: 'Title is required', onChange :()=>setNewProblem(true) })}
                placeholder="Problem Title"
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Problem Statement */}
            <div>
              <label htmlFor="statement" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Problem Statement</label>
              <textarea
                id="statement"
                {...register('statement', { required: 'Problem statement is required' })}
                rows="6"
                placeholder="Describe the problem here..."
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
              />
              {errors.statement && <p className="text-red-500 text-sm">{errors.statement.message}</p>}
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Constraints</label>
              <textarea
                id="constraints"
                {...register('constraints', { required: 'Constraints are required' })}
                rows="3"
                placeholder="1 ≤ N ≤ 10^5"
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
              />
              {errors.constraints && <p className="text-red-500 text-sm">{errors.constraints.message}</p>}
            </div>

            {/* Testcases */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Test Cases</label>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-2 flex gap-2">
                  <input
                    placeholder="Input"
                    {...register(`testcases.${index}.input`, { required: true })}
                    className="w-1/2 p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    placeholder="Expected Output"
                    {...register(`testcases.${index}.output`, { required: true })}
                    className="w-1/2 p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => append({ input: '', output: '' })} className="text-blue-600 mt-1">
                + Add Test Case
              </button>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Difficulty</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" value="easy" {...register('difficulty', { required: true })} className="text-green-500" />
                  <span className="ml-2 text-green-600 font-medium">Easy</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="medium" {...register('difficulty')} className="text-yellow-500" />
                  <span className="ml-2 text-yellow-500 font-medium">Medium</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="hard" {...register('difficulty')} className="text-red-500" />
                  <span className="ml-2 text-red-500 font-medium">Hard</span>
                </label>
              </div>
              {errors.difficulty && <p className="text-red-500 text-sm">Select a difficulty</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Submit Problem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateProblem;

