/*
import React , {useState,useEffect} from 'react'
import logo from '../assets/logo.png'
import {auth} from '../utils/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import ForgotPassword from './ForgotPassword';
import Popover from './Popover';
export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSentPopup, setEmailSentPopup] = useState(false);
  
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const changeEmail = (e) => {
    setEmail(e.target.value)
  }
  

  
   const submitForm = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in successfully');
            navigate('/');

            // Redirect to another page or perform other actions on successful sign-in
          } catch (error) {
            console.error('Error signing in:', error);
            setError('Failed to sign in. Invalid Credentials');
          }
        
   }

    const handleForgotPassword = () => {
      setShowForgotPassword(true);
    }
    const handlePasswordReset = (email) => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setEmailSentPopup(true);
        })
        .catch((error) => {
          // Handle error
          console.error("Error sending email: ", error);
        });
    };


  return (
    <div class="m-0 h-screen w-screen bg-[url('D:\Internship_Work\React_Works\BlogPage_Work\Nimitta_react_blog_backend\src\assets\login-bg.jpg')] object-cover">
        <div class="flex justify-center items-center w-full h-full">
            {showForgotPassword && (<ForgotPassword onClose={(email) => {
              setShowForgotPassword(false);
              handlePasswordReset(email);
              setEmailSentPopup(true);
            }}
            onCancel={() =>{
              setShowForgotPassword(false);
            }}
            />) }
            {emailSentPopup && (<Popover onClose={() => setEmailSentPopup(false)} message="An email has been sent to your email address." />)}
            <div class="flex justify-center items-start">
            <div class="w-full bg-white rounded-sm shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8 ">
                  <div class="flex justify-center">   
                    <img src={logo} class="h-30 w-96" alt="Logo" />
                  </div>
                  <div class="flex flex-col justify-center items-center space-y-2">
                    <h1 class="text-3xl text-center font-bold font-sans  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Welcome back!
                    </h1>
                    <p class="text-sm text-center font-sans leading-tight tracking-tight text-gray-900 md:text-sm dark:text-white">
                        Please login using your account.
                    </p>
                  </div>
                  <form class="space-y-4 md:space-y-6" action="#">
                      <div>
                          <label for="email" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Username or Email</label>
                          <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={changeEmail} placeholder="name@company.com" required=""/>
                      </div>
                      <div>
                        <label htmlFor="password" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={handlePasswordChange}
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          >
                            {showPassword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="25" height="20" class="text-gray-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="25" height="20" class="text-gray-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      {error && <p className="text-red-500">{error}</p>}
                      <div class="flex items-center justify-between">
                          <div class="flex items-start">
                              <div class="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                              </div>
                              <div class="ml-3 text-sm">
                                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                              </div>
                          </div>
                          <a href="#" class="text-sm font-medium text-blue-500 hover:underline dark:text-primary-500"
                          onClick={handleForgotPassword}
                          >Forgot password?</a>
                      </div>

                      

                      <button type="submit" class="w-full text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={submitForm}>LOGIN</button>
                
                    </form>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}
*/

import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/logo.png';
import Popover from './Popover';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = () => {

  //state to switch between login and signup
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //error states
  const [loginError,setLoginError] = useState('');
  const [signupError,setSignupError] = useState('');

  //popover states
  const [showLoginPopover, setShowLoginPopover] = useState(false);
  const [showSignupPopover,setShowSignupPopover] = useState(false);

  //function to toggle password visibility
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  //for navigation
  const navigate = useNavigate();

  //function to handle signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    //regex for password strength
    const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    //check if password is strong
    if (!passwordStrength.test(password)) {
      setSignupError('Use a strong password with at least 8 characters, one uppercase, one lowercase letter, one number and one special character.');
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      setShowSignupPopover(true);
      setSignupError('');
    } catch (error) {
      setSignupError("The entered email address is already in use.");
    }
  };

  //function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoginPopover(true);
      navigate('/');
      setLoginError('');
    } catch (error) {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="m-0 h-screen w-screen bg-[url('D:\\Internship_Work\\React_Works\\BlogPage_Work\\Nimitta_react_blog_backend\\src\\assets\\login-bg.jpg')] object-cover">
      
      {/* Popover for login and signup success */}
      {showLoginPopover && <Popover message="Login successful!" onClose={() => setShowLoginPopover(false)} />}
      {showSignupPopover && <Popover message="Sign up successful!" onClose={() => setShowSignupPopover(false)} />}
      
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full bg-white rounded-sm shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* Logo */}
            <div className="flex justify-center">
              <img src={logo} className="h-30 w-96" alt="Logo" />
            </div>
            
            {/* Login and signup switch */}
            <div className="flex justify-center w-full">
              <button onClick={() => setIsLogin(true)} className={`mr-2 w-[50%] p-1 ${isLogin ? 'border-b-2 border-b-blue-400 text-orange-500' : 'text-gray-500 '}`}>Login</button>
              <button onClick={() => setIsLogin(false)} className={`w-[50%] p-1 ${!isLogin ? 'border-b-2 border-b-blue-400 text-orange-500' : 'text-gray-500'}`}>Sign Up</button>
            </div>

            {isLogin ? (
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                {/* Login form */}
                <h1 className="text-3xl text-center font-bold font-sans  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Welcome back!
                </h1>

                {/* Username or email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Username or Email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="25" height="20" className="text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="25" height="20" className="text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {loginError && <p className="text-red-500">{loginError}</p>}
                <button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center ">LOGIN</button>
              </form>
            ) : (
              <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
                {/* Signup form */}
                <h1 className="text-3xl text-center font-bold font-sans  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Username</label>
                  <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setUsername(e.target.value)} placeholder="John Doe" required />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="25" height="20" className="text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="25" height="20" className="text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {signupError && <p className="text-red-500">{signupError}</p>}
                <button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center ">SIGN UP</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
