import React from 'react'
import {Link} from 'react-router-dom'
import {set, useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Signup() {
    const navigate = useNavigate();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const[userexists, setuserexists] = useState(false);

  async function onSubmit(data) {

    setuserexists(false);
    try{
        console.log(data);
        let responce = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/signup`, data);
        console.log(responce)
    
    
    
        // things which are to be done
        // based on responce we can redirect to login page
        if(responce.status == 201){
            navigate('/login');
        }
    }
    catch(error){
                if (error.response && error.response.status === 409) {
            setuserexists(true); // Show user exists message
            } else {
            console.error('Registration failed:', error);
            alert('Something went wrong. Please try again.');
            }
    }
    
    // else display user already registered with this email

  }
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>


              {userexists && <p className="text-red-500 text-xs italic">User already exists</p>}







              <form className="space-y-4 md:space-y-6" onSubmit ={handleSubmit(onSubmit)}>
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" 
                      {...register("name",
                        {required : {
                            value : true,
                            message : "Name is required"
                        },
                        minLength : {
                            value : 3,
                            message : "Name should be atleast 3 characters"
                        }  , 
                        maxLength : {
                            value : 50,
                            message : "Name should be less than 50 characters"
                        }})} />

                      {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                  </div>





                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" 
                      {...register("email",
                      {required : true, minLength : 3, maxLength : 50})} />
                  </div>





                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      {...register("password",
                      {required :{
                          value : true,
                          message : "Password is required"
                      },
                      minLength : {
                          value : 3,
                          message : "Password should be atleast 3 characters"
                      } ,
                      maxLength : {
                          value : 50,   
                          message : "Password should be less than 50 characters"
                      }
                      })} />
                  </div>





                  {/* <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div> */}
                  {/* <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <Link  className="font-medium text-primary-600 hover:underline dark:text-primary-500" to="/service/spr">Terms and Conditions</Link></label>
                      </div>
                  </div> */}
                  <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Signup
