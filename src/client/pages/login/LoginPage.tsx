import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../activities/UserLogin"; // Assuming the login function is exported from here
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import Spinner from "../../components/ui/spinner";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for toast notifications

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { userUid , accessToken, errorMessage } = await login(email, password);

      if (errorMessage) {
        toast.error(errorMessage); // Show error message
      } else {
        toast.success("Login successful!"); // Show success message
        sessionStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userUid" , userUid)
        navigate("/market"); // Redirect to the marketplace after successful login
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register"); // Navigate to the registration page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-200 text-gray-900 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-lg"> {/* Adjusted size and corner radius */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="default" disabled={isLoading} className="w-full bg-blue-600 hover:bg-cyan-500 text-white">
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={handleGoToRegister} className="text-blue-600 hover:text-blue-500">
            Don't have an account? Register here
          </Button>
        </div>
      </div>

      {/* Toast container (this will render the toasts on top of the page) */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
