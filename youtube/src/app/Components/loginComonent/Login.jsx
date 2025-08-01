'use client'
import React, { useContext, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../FirebaseConfig';
import { FaGoogle, FaEye, FaEyeSlash, FaYoutube } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosInstance from '../axioscomponent/axiosinstances';
import { MainContextProvider } from '@/app/MainContext';

export default function Login() {

  let {user}=useContext(MainContextProvider)
  let [name,setname]=useState('')
  let [email,setemail]=useState('')
  let [password,setpassword]=useState('')
  let [phonenumber,setphonenumber]=useState(null)
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: ''
//   });

//   const auth = getAuth(app);
//   const googleProvider = new GoogleAuthProvider();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.email || !formData.password) {
//       toast.error('Please fill in all required fields');
//       return false;
//     }

//     if (!isLogin) {
//       if (!formData.name) {
//         toast.error('Please enter your name');
//         return false;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         toast.error('Passwords do not match');
//         return false;
//       }
//       if (formData.password.length < 6) {
//         toast.error('Password must be at least 6 characters long');
//         return false;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, formData.email, formData.password);
//         toast.success('Successfully logged in!');
//       } else {
//         await createUserWithEmailAndPassword(auth, formData.email, formData.password);
//         toast.success('Account created successfully!');
//       }
//     } catch (error) {
//       let errorMessage = 'An error occurred';
//       switch (error.code) {
//         case 'auth/user-not-found':
//           errorMessage = 'No account found with this email';
//           break;
//         case 'auth/wrong-password':
//           errorMessage = 'Incorrect password';
//           break;
//         case 'auth/email-already-in-use':
//           errorMessage = 'An account with this email already exists';
//           break;
//         case 'auth/weak-password':
//           errorMessage = 'Password is too weak';
//           break;
//         case 'auth/invalid-email':
//           errorMessage = 'Invalid email address';
//           break;
//         default:
//           errorMessage = error.message;
//       }
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await signInWithPopup(auth, googleProvider);
//       toast.success('Successfully signed in with Google!');
//     } catch (error) {
//       toast.error('Failed to sign in with Google');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setFormData({
//       email: '',
//       password: '',
//       confirmPassword: '',
//       name: ''
//     });
//   };

let userformdata=new FormData()
userformdata.append("name",name)
userformdata.append("email",email)
userformdata.append("password",password)
userformdata.append("phonenumber",phonenumber)

let handleregister=async()=>{
  const userauthdata=await fetch('https://youtube-clone-oprs.onrender.com/user/userdata/getuserdata', {
    method:'POST',
    body:userformdata
  })
  if (!userauthdata.ok) {
    const errorData = await userauthdata.json();
    console.log('Error response:', errorData);
    
  }
  
  const data = await userauthdata.json();
  toast.success("Upload Successfully!");
  
} 



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer position="top-right" />
      
      <div className="max-w-md w-full rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaYoutube className="text-red-600 text-4xl mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">YouTube</h1>
          </div>
          {/* <h2 className="text-2xl font-semibold text-gray-700">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Welcome back! Please sign in to your account.' : 'Join YouTube to share and discover amazing videos.'}
          </p> */}
        </div>

            <form action="" onSubmit={handleregister} >
              <div className="">
                <label htmlFor="">Name</label>
                <input type="text" name="" id="username" onChange={(event)=>setname(event.target.value)} className='w-full border'/>
              </div>
              <div className="">
                <label htmlFor="">email</label>
                <input type="email" name="" id="useremail" onChange={(event)=>setname(event.target.value)} className='w-full border'/>
              </div>
              <div className="">
                <label htmlFor="">password</label>
                <input type="password" name="" id="userpassword" onChange={(event)=>setname(event.target.value)} className='w-full border' />
              </div>
              <div className="">
                <label htmlFor="">phone number</label>
                <input type="tel" name="" id="userphonenumber" onChange={(event)=>setname(event.target.value)} className='w-full border'/>
              </div>
              <button type="button" className='border'>submit</button>
            </form>

        {/* Form */}
        {/* <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form> */}

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

{/*         
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <FaGoogle className="text-red-600 mr-2" />
          Continue with Google
        </button>

        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 text-red-600 hover:text-red-700 font-medium transition duration-200"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        
        {!isLogin && (
          <p className="text-xs text-gray-500 text-center mt-4">
            By creating an account, you agree to YouTube's{' '}
            <a href="#" className="text-red-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
          </p>
        )} */}
      </div>
    </div>
  );
}