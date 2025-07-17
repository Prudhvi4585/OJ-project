import React from 'react';
import { set, useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const DeleteProblem = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [successMessage, setSuccessMessage] = useState('');
  const [problemexists, setProblemexists] = useState(true);

  const handleInputChange = (e) => {
    setProblemexists(true);
    setSuccessMessage('');
  };
  const onSubmit = async(data) => {
    console.log(data);
    setSuccessMessage('');
    setProblemexists(true);
    try{
      // const res = await axios.delete('http://localhost:3000/api/v1/problems/deleteProblem', data);
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/problems/deleteProblem`, {
        data: { title: data.title },
      });
      console.log(res);
      setSuccessMessage('✅ Problem deleted successfully!');
      reset();
    }
    catch(err){
      console.log(err);
      if (err.response?.status === 404) {
        // setSuccessMessage('❌ Problem not found!');
        setProblemexists(false);
      } else {
        alert("Something went wrong!");
      }
    }
    // You can send a DELETE request like:
  

  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delete a Problem</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            {successMessage && <p className="text-green-600 font-semibold mb-2">{successMessage}</p>}
            {(!problemexists) && <p className ='text-red-500 text-sm'>problem not found</p>}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Title of the Problem
              </label>
              <input
                id="title"
                {...register('title', {
                  required: 'Problem title is required to delete',
                  minLength: { value: 3, message: 'Minimum 3 characters required' },
                })}
                placeholder="Enter the title of the problem to delete"
                className="w-full p-2.5 rounded-lg border bg-gray-50 border-gray-300 dark:bg-gray-700 dark:text-white" onChange={handleInputChange }
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Delete Problem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DeleteProblem;
