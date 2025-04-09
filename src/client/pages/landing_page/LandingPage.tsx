import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/client/components/ui/button";
import { Card, CardContent } from "@/src/client/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, DollarSign, Clock, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoToTransactions = () => {
    navigate("/transactions");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  const handleGoToMarketplace = () => {
    navigate("/marketplace");
  };

  const features = [
    {
      title: "Secure Transactions",
      description: "Industry-leading security protocols ensure your crypto assets stay safe.",
      icon: <ShieldCheck className="text-blue-500 w-8 h-8" />
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. What you see is what you pay, every time.",
      icon: <DollarSign className="text-blue-500 w-8 h-8" />
    },
    {
      title: "24/7 Support",
      description: "Our dedicated team is always available to assist with your needs.",
      icon: <Clock className="text-blue-500 w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400 filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-400 filter blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto relative z-10 px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mb-4 inline-block">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.3 
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Now with enhanced security
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                BitSlowShop
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              The slowest yet safest way to buy your favorite crypto:{" "}
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                BitSlow
              </span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6"
          >
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              onClick={handleGoToTransactions}
            >
              Buy BitSlow Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-8 py-6 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
              onClick={handleGoToRegister}
            >
              Register Account
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Why Choose BitSlowShop?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              We prioritize security and transparency above all, ensuring your crypto investments are in safe hands.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white border border-gray-100 rounded-xl shadow-md h-full overflow-hidden">
                  <CardContent className="p-6">
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={handleGoToMarketplace}
            >
              Explore Marketplace
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-500 text-xl font-bold">"</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">What Our Users Say</h3>
              </div>
              
              <p className="text-xl text-gray-600 italic mb-6">
                "BitSlowShop provides the perfect balance between security and usability. I've never felt safer 
                making crypto transactions, and their customer support is unmatched in the industry."
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-800">Alex Johnson</p>
                  <p className="text-gray-500 text-sm">Crypto Enthusiast</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-4 md:mb-0">
              BitSlowShop
            </h3>
            <div className="flex space-x-6">
              
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center md:text-left">
            <p className="text-gray-400">
              © {new Date().getFullYear()} BitSlowShop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}