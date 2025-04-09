import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../requrests/UserLogin";
import { parseToken } from "../../requrests/parseJWT";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import Spinner from "../../components/ui/spinner";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  Lock, 
  Mail, 
  Bitcoin, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRightCircle, 
  UserPlus, 
  AlertTriangle,
  Fingerprint
} from "lucide-react";
import { SiBit } from "react-icons/si";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { accessToken, errorMessage } = await login(email, password);
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Login successful! Welcome to BitSlowShop");
        const decodedToken = parseToken(accessToken);
        sessionStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userUid", decodedToken.userUid);
        localStorage.setItem("role", decodedToken.userRole);
        navigate("/transactions");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

 

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-900 p-6 flex flex-col items-center justify-center">
      {/* Floating crypto icons */}
      <div className="absolute top-10 left-10 opacity-10">
        <SiBit size={80} className="text-yellow-400" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <SiBit size={60} className="text-yellow-400" />
      </div>
      
      {/* Logo and header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <SiBit size={36} className="text-yellow-400 mr-2" />
          <h1 className="text-4xl font-bold text-white">BitSlowShop</h1>
        </div>
        <p className="text-gray-300 italic">Secure crypto trading, at your pace</p>
      </div>
      
      {/* Main card */}
      <div className="max-w-md w-full bg-white backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-yellow-100 rounded-full opacity-20"></div>
        <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-blue-100 rounded-full opacity-20"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1 text-center text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Sign in to access your crypto wallet</p>
          
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center">
                <Mail size={16} className="text-gray-500 mr-2" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  placeholder="your@email.com"
                />
                <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center">
                <Lock size={16} className="text-gray-500 mr-2" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <button 
                  type="button" 
                  onClick={toggleShowPassword} 
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
          
            <div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <ArrowRightCircle size={18} className="mr-2" />
                    Sign In to BitSlowShop
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleGoToRegister}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center py-2"
            >
              <UserPlus size={18} className="mr-2" />
              Create New Account
            </Button>
          </div>
          
          {/* Security badges */}
          <div className="flex items-center justify-center space-x-4 pt-4 pb-2 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-xs">
              <Shield size={14} className="mr-1 text-green-500" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center text-gray-500 text-xs">
              <Fingerprint size={14} className="mr-1 text-green-500" />
              <span>Encrypted</span>
            </div>
          </div>
          
          {/* Warning for demo purposes */}
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5" />
              <p className="text-yellow-700 text-xs">
                This is a secure connection. Never share your wallet keys or passwords with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-gray-400 text-xs">
        <p>© 2025 BitSlowShop | All rights reserved</p>
      </div>
      
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default LoginPage;