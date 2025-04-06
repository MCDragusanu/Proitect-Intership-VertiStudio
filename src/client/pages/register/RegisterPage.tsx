import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../activities/UserRegister"; 
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import Spinner from "../../components/ui/spinner";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phonePrefix, setPhonePrefix] = useState(""); // Country code (e.g. +1)
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number without the prefix
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { userUid, lastLogin, accessToken, errorMessage } = await register(
        email,
        password,
        firstName,
        lastName,
        country,
        city,
        phonePrefix + phoneNumber, // Combine the phone prefix and phone number
        address
      );
      //save the credentials
      sessionStorage.setItem( "accessToken", accessToken)
      localStorage.setItem("userUid" , userUid)

      if (errorMessage) {
        toast.error(errorMessage); // Use toast to show error message
      } else {
        toast.success("Registration successful! Welcome to BitSlowShop."); // Success toast
        navigate("/transactions"); 
      }
    } catch (error) {
      toast.error("An error occurred during registration."); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-200 text-gray-900 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-lg"> {}
        {/* Tabs for switching between steps */}
        <div className="relative flex justify-between mb-6 border-b-2 border-gray-300">
          <Button 
            variant={"outline"} 
            onClick={() => setStep(1)} 
            className={`relative px-4 py-2 text-lg ${step === 1 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Step 1: Sign Up
            {step === 1 && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transition-all duration-300"></div>}
          </Button>
          
          <Button 
            variant={"outline"} 
            onClick={() => setStep(2)} 
            className={`relative px-4 py-2 text-lg ${step === 2 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Step 2: Complete Your Details
            {step === 2 && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transition-all duration-300"></div>}
          </Button>
        </div>

       

        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
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

            <Button type="submit" variant="default" className="w-full bg-blue-600 hover:bg-cyan-500 text-white">
              Next
            </Button>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="phonePrefix">Phone Prefix</Label>
                <Input
                  id="phonePrefix"
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  placeholder="+1"
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="default" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              {isLoading ? <Spinner /> : "Register"}
            </Button>
          </form>
        )}

        {/* Button to go to login page */}
        <div className="mt-4 text-center">
          <Button variant="link" onClick={handleGoToLogin} className="text-blue-600 hover:text-blue-500">
            Already have an account? Login here
          </Button>
        </div>
      </div>

      {/* Toast container (this will render the toasts on top of the page) */}
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
