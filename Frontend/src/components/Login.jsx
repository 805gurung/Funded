import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from './Navbar/Navbar';
import { login, authenticate } from '../api/UserApi'; // Import API functions

export default function Login() {
  const navigate = useNavigate(); // React Router navigation hook
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // Call the login API with only email and password
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      // Check if login was successful
      if (response.error) {
        // Show error with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: response.error,
          confirmButtonColor: '#2563eb'
        });
        setApiError(response.error);
      } else if (response.token || response.jwt) {
        // If successful, authenticate the user
        authenticate(response);
        
        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back to Himalaya Fund',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#2563eb'
        }).then(() => {
          // Redirect to homepage after SweetAlert closes
          navigate('/');
        });
        
        // Reset form
        setFormData({
          email: '',
          password: ''
        });
      } else {
        // Generic error with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Login failed. Please try again.',
          confirmButtonColor: '#2563eb'
        });
        setApiError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please try again later.',
        confirmButtonColor: '#2563eb'
      });
      
      setApiError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      

      <div className="min-w-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-blue-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-600">
              Sign in to your Himalaya Fund account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Error Display */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-blue-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-700 hover:text-blue-500 transition-colors">
                  Create one here
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-l text-blue-500">
              Empowering dreams across the Himalayas
            </p>
          </div>
        </div>
      </div>
    </>
  );
}