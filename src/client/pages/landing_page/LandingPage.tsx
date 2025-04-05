import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/client/components/ui/button";
import { Card, CardContent } from "@/src/client/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoToMarket = () => {
    navigate("/market");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-100 to-purple-200 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto text-center py-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-gray-800"
        >
          Welcome to <span className="text-blue-600">BitSlowShop</span>
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          The slowest yet safest way to buy your favorite crypto:{" "}
          <span className="text-purple-600 font-semibold">Bitslow</span>
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <Button
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleGoToMarket}
          >
            Buy Bitslow Now
          </Button>
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleGoToRegister}
          >
            Register
          </Button>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 py-12">
        {["Secure Transactions", "Transparent Pricing", "24/7 Support"].map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-2 border-cyan-300 rounded-2xl shadow-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 ease-in-out">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="text-cyan-500 w-6 h-6" />
                  <h3 className="text-xl font-semibold text-gray-800">{feature}</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Enjoy {feature.toLowerCase()} when you shop for Bitslow on BitSlowShop.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <footer className="text-center text-gray-600 text-sm py-8">
        © 2025 BitSlowShop. All rights reserved.
      </footer>
    </div>
  );
}
