import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../requrests/UserRegister";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import Spinner from "../../components/ui/spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseToken } from "../../requrests/parseJWT";
import {
	Bitcoin,
	Mail,
	Lock,
	User,
	MapPin,
	Phone,
	Home,
	Globe,
	Building,
	CheckCircle2,
	ChevronRight,
	ArrowLeft,
	Shield,
	Eye,
	EyeOff,
	ArrowRightCircle,
	LogIn,
} from "lucide-react";

const RegisterPage: React.FC = () => {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [phonePrefix, setPhonePrefix] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleStep1Submit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match!");
			return;
		}

		setStep(2);
	};

	const handleBackToStep1 = () => {
		setStep(1);
	};

	const handleStep2Submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { accessToken, errorMessage } = await register(
				email,
				password,
				firstName,
				lastName,
				country,
				city,
				phonePrefix + phoneNumber,
				address,
			);

			if (errorMessage) {
				toast.error(errorMessage);
			} else {
				const decodedToken = parseToken(accessToken);
				sessionStorage.setItem("accessToken", accessToken);
				localStorage.setItem("userUid", decodedToken.userUid);
				localStorage.setItem("role", decodedToken.userRole);

				toast.success("Registration successful! Welcome to BitSlowShop.");
				navigate("/transactions");
			}
		} catch (error) {
			console.log(error);
			toast.error("An error occurred during registration.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoToLogin = () => {
		navigate("/login");
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br  from-blue-900 via-sky-800 to-cyan-900 p-6 flex flex-col items-center justify-center">
			{/* Floating crypto icons */}
			<div className="absolute top-10 left-10 opacity-10">
				<Bitcoin size={80} className="text-yellow-400" />
			</div>
			<div className="absolute bottom-10 right-10 opacity-10">
				<Bitcoin size={60} className="text-yellow-400" />
			</div>

			{/* Logo and header */}
			<div className="mb-6 text-center">
				<div className="flex items-center justify-center mb-2">
					<Bitcoin size={36} className="text-yellow-400 mr-2" />
					<h1 className="text-4xl font-bold text-white">BitSlowShop</h1>
				</div>
				<p className="text-gray-300 italic">Join our secure crypto community</p>
			</div>

			{/* Main card */}
			<div className="max-w-2xl w-full bg-white backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
				{/* Background decoration */}
				<div className="absolute -right-16 -top-16 w-48 h-48 bg-yellow-100 rounded-full opacity-20"></div>
				<div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>

				<div className="relative z-10">
					{/* Progress indicator */}
					<div className="flex items-center justify-center mb-6">
						<div className="flex items-center w-full max-w-sm">
							<div
								className={`flex flex-col items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
							>
								<div
									className={`rounded-full flex items-center justify-center w-8 h-8 ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
								>
									{step > 1 ? <CheckCircle2 size={16} /> : 1}
								</div>
								<span className="text-xs mt-1">Account</span>
							</div>

							<div
								className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
							></div>

							<div
								className={`flex flex-col items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
							>
								<div
									className={`rounded-full flex items-center justify-center w-8 h-8 ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
								>
									2
								</div>
								<span className="text-xs mt-1">Profile</span>
							</div>
						</div>
					</div>

					<h2 className="text-2xl font-bold mb-1 text-center text-gray-800">
						{step === 1 ? "Create Your Account" : "Complete Your Profile"}
					</h2>
					<p className="text-gray-500 text-sm text-center mb-6">
						{step === 1
							? "Join BitSlowShop and start trading crypto"
							: "Tell us more about yourself"}
					</p>

					{step === 1 ? (
						<form onSubmit={handleStep1Submit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium flex items-center"
								>
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
									<Mail
										size={18}
										className="absolute left-3 top-2.5 text-gray-400"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-sm font-medium flex items-center"
								>
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
										placeholder="Create a strong password"
									/>
									<Lock
										size={18}
										className="absolute left-3 top-2.5 text-gray-400"
									/>
									<button
										type="button"
										onClick={toggleShowPassword}
										className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								<p className="text-xs text-gray-500 pl-2">
									Password must be at least 8 characters long
								</p>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-sm font-medium flex items-center"
								>
									<Shield size={16} className="text-gray-500 mr-2" />
									Confirm Password
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										className="pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										placeholder="Confirm your password"
									/>
									<Shield
										size={18}
										className="absolute left-3 top-2.5 text-gray-400"
									/>
									<button
										type="button"
										onClick={toggleShowConfirmPassword}
										className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</div>

							<div>
								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mt-4"
								>
									<span>Continue</span>
									<ChevronRight size={18} className="ml-2" />
								</Button>
							</div>
						</form>
					) : (
						<form onSubmit={handleStep2Submit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="firstName"
										className="text-sm font-medium flex items-center"
									>
										<User size={16} className="text-gray-500 mr-2" />
										First Name
									</Label>
									<div className="relative">
										<Input
											id="firstName"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<User
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="lastName"
										className="text-sm font-medium flex items-center"
									>
										<User size={16} className="text-gray-500 mr-2" />
										Last Name
									</Label>
									<div className="relative">
										<Input
											id="lastName"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<User
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="country"
										className="text-sm font-medium flex items-center"
									>
										<Globe size={16} className="text-gray-500 mr-2" />
										Country
									</Label>
									<div className="relative">
										<Input
											id="country"
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<Globe
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="city"
										className="text-sm font-medium flex items-center"
									>
										<Building size={16} className="text-gray-500 mr-2" />
										City
									</Label>
									<div className="relative">
										<Input
											id="city"
											value={city}
											onChange={(e) => setCity(e.target.value)}
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<Building
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="phonePrefix"
										className="text-sm font-medium flex items-center"
									>
										<Phone size={16} className="text-gray-500 mr-2" />
										Phone Prefix
									</Label>
									<div className="relative">
										<Input
											id="phonePrefix"
											value={phonePrefix}
											onChange={(e) => setPhonePrefix(e.target.value)}
											placeholder="+1"
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<Phone
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="phoneNumber"
										className="text-sm font-medium flex items-center"
									>
										<Phone size={16} className="text-gray-500 mr-2" />
										Phone Number
									</Label>
									<div className="relative">
										<Input
											id="phoneNumber"
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value)}
											required
											className="pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
										/>
										<Phone
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>

								<div className="space-y-2 col-span-1 md:col-span-2">
									<Label
										htmlFor="address"
										className="text-sm font-medium flex items-center"
									>
										<MapPin size={16} className="text-gray-500 mr-2" />
										Address
									</Label>
									<div className="relative">
										<Textarea
											id="address"
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											required
											className="pl-10 pt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
											rows={3}
										/>
										<Home
											size={18}
											className="absolute left-3 top-2.5 text-gray-400"
										/>
									</div>
								</div>
							</div>

							<div className="flex gap-4 pt-2">
								<Button
									type="button"
									variant="outline"
									onClick={handleBackToStep1}
									className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg flex items-center justify-center"
								>
									<ArrowLeft size={18} className="mr-2" />
									Back
								</Button>

								<Button
									type="submit"
									disabled={isLoading}
									className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
								>
									{isLoading ? (
										<Spinner />
									) : (
										<>
											<ArrowRightCircle size={18} className="mr-2" />
											Complete Sign Up
										</>
									)}
								</Button>
							</div>
						</form>
					)}

					{/* KYC notice */}
					<div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
						<div className="flex items-start">
							<Shield size={16} className="text-blue-500 mr-2 mt-0.5" />
							<p className="text-blue-700 text-xs">
								BitSlowShop follows strict KYC (Know Your Customer) regulations.
								Your information is securely encrypted and only used for
								verification purposes.
							</p>
						</div>
					</div>

					{/* Login link */}
					<div className="mt-6 text-center">
						<Button
							variant="link"
							onClick={handleGoToLogin}
							className="text-blue-600 hover:text-blue-500 flex items-center justify-center mx-auto"
						>
							<LogIn size={16} className="mr-2" />
							Already have an account? Login here
						</Button>
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

export default RegisterPage;
