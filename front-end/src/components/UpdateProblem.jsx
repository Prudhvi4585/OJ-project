import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';

const UpdateProblem = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchTitle: '',
      testcases: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testcases',
  });

  // 🔍 Search and Load
  const handleSearch = async (title) => {
    if (!title.trim()) return;
    setLoading(true);
    setNotFound(false);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await axios.get(`http://localhost:3000/api/v1/problems/getProblemByTitle/${title}`);
      const data = res.data;
      reset({ ...data, searchTitle: title }); // Reset form with data
    } catch (error) {
      console.error(error);
      setNotFound(true);
    }
    setLoading(false);
  };

  // ✅ Submit update
  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');

    const oldTitle = getValues('searchTitle');
    const newTitle = data.title;

    if (!oldTitle) {
      setErrorMessage('❌ Please search and load a problem before updating.');
      return;
    }

    try {
      // Re-verify existence
      const check = await axios.get(`http://localhost:3000/api/v1/problems/getProblemByTitle/${oldTitle}`);
      if (!check.data) {
        setErrorMessage('❌ The original problem title no longer exists.');
        return;
      }

      const payload = {
        oldtitle: oldTitle,
        newtitle: newTitle,
        statement: data.statement,
        constraints: data.constraints,
        difficulty: data.difficulty,
        testcases: data.testcases,
      };

      await axios.put(`http://localhost:3000/api/v1/problems/updateProblem`, payload);
      setSuccessMessage('✅ Problem updated successfully!');
    } catch (err) {
      console.error('Update failed', err);
      if (err.response?.status === 404) {
        setErrorMessage('❌ Problem with the original title was not found!');
      } else if (err.response?.status === 409) {
        setErrorMessage('⚠️ A problem with the new title already exists.');
      } else {
        setErrorMessage('❌ Update failed due to server error.');
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update a Problem</h2>

          {/* 🔔 Message Banners */}
          {successMessage && (
            <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-400 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-400 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* 🔍 Search */}
          <div className="mb-6">
            <label htmlFor="searchTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Search Problem by Title (Which will be updated)
            </label>
            <div className="flex gap-2">
              <input
                id="searchTitle"
                type="text"
                placeholder="Enter title to search"
                {...register('searchTitle')}
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(getValues('searchTitle'));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleSearch(getValues('searchTitle'))}
                className="px-4 bg-blue-600 text-white rounded-lg"
              >
                Search
              </button>
            </div>
            {loading && <p className="text-yellow-500 text-sm mt-2">Loading...</p>}
            {notFound && <p className="text-red-500 text-sm mt-2">Problem not found!</p>}
          </div>

          {/* 📝 Update Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Problem Title</label>
              <input
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Statement */}
            <div>
              <label htmlFor="statement" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Problem Statement</label>
              <textarea
                id="statement"
                {...register('statement', { required: 'Problem statement is required' })}
                rows="6"
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
              />
              {errors.statement && <p className="text-red-500 text-sm">{errors.statement.message}</p>}
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Problem Constraints</label>
              <textarea
                id="constraints"
                {...register('constraints', { required: 'Constraints are required' })}
                rows="3"
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white"
              />
              {errors.constraints && <p className="text-red-500 text-sm">{errors.constraints.message}</p>}
            </div>

            {/* Test Cases */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Problem Test Cases</label>
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
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Problem Difficulty</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" value="easy" {...register('difficulty', { required: true })} />
                  <span className="ml-2 text-green-600 font-medium">Easy</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="medium" {...register('difficulty')} />
                  <span className="ml-2 text-yellow-500 font-medium">Medium</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="hard" {...register('difficulty')} />
                  <span className="ml-2 text-red-500 font-medium">Hard</span>
                </label>
              </div>
              {errors.difficulty && <p className="text-red-500 text-sm">Select a difficulty</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800"
            >
              Update Problem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateProblem;
