import React from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';




function Login() {

  const navigate = useNavigate();
  const[correctCredentials, setCorrectCredentials] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setCorrectCredentials(false);
    try{
        console.log(data);
        let responce = await axios.post('http://localhost:3000/api/v1/users/login', data);
        console.log(responce)

        if(responce.status == 200)
        {
            localStorage.setItem('token', responce.data.token);
            setCorrectCredentials(true);
            navigate('/');
        }
    }
    catch(error)
    {
        if(error.response && error.response.status == 401)
        {
            setCorrectCredentials(false);
        }
        else{
            console.error('Login failed:', error);
            alert('Something went wrong. Please try again.');
        }
    }
    // things which are to be done

    // based on responce we can redirect to home page
     
    // else display user entered wrong email or password

  }
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>

              {correctCredentials==false && <p className="text-red-500 text-xs italic">Incorrect email or password</p>}




              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>


                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" 
                       {...register("email",
                        {
                          required : true,
                          // pattern : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          // message : "Please enter a valid email address"
                        }
                       )}/>
                       {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                  </div>


                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("password", {
                          required : 
                          {
                              value : true, 
                              message : "Password is required"
                          },
                          minLength :
                          {
                              value : 3,
                              message : "Password should be atleast 3 characters"
                          },
                          maxLength :
                          {
                              value : 50,
                              message : "Password should be less than 50 characters"
                          },
                      })}/>
                      {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                  </div>





                  <div className="flex items-center justify-between">
                      {/* <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div> */}
                      {/* <Link to="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link> */}
                  </div>



                  <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Login