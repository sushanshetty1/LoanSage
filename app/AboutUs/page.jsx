"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import the Image component from Next.js
import Sushan from "@/public/Sushan.jpg"; // Import the image correctly
import Sharva from "@/public/sharva.jpg";
const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sushan Shetty",
      role: "Full Stack Developer",
      bio: "Specializes in MERN stack development and cloud technologies.",
      github: "https://github.com/sushanshetty1",
      linkedin: "https://linkedin.com/in/sushanshetty1",
      email: "sushanshetty1470@gmail.com",
      image: Sushan, // Correctly reference the imported image
    },
    {
      name: "Sharva Dhanvi",
      role: "Frontend Developer",
      bio: "Specializes in modern web technologies and responsive design.",
      github: "https://github.com/Sharva05",
      linkedin: "https://linkedin.com/in/sharva-dhanvi-v",
      email: "sharvadhanvi.v@gmail.com",
      image: Sharva, // Path to the image in the public folder
    },
    {
      name: "Sudarshan J",
      role: "AI/ML Engineer",
      bio: "Specializes in multilingual AI models and voice technologies.",
      github: "https://github.com/sudarshanj",
      linkedin: "https://linkedin.com/in/alicejohnson",
      email: "alice.johnson@example.com",
      image: "/images/sudarshan.jpg", // Path to the image in the public folder
    },
    {
      name: "Bob Brown",
      role: "DevOps Engineer",
      bio: "Ensures seamless deployment and infrastructure management.",
      github: "https://github.com/bobbrown",
      linkedin: "https://linkedin.com/in/bobbrown",
      email: "bob.brown@example.com",
      image: "/images/bob.jpg", // Path to the image in the public folder
    },
  ];

  return (
    <div className="relative pt-32 pb-16 md:pb-24 overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: 0.3, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 0.2, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* About the Website */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            About Us
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We are a team of passionate developers and engineers building
            innovative solutions to simplify loan processes. Our platform offers
            personalized loan recommendations, multilingual support, and
            real-time comparisons to help you make informed financial decisions.
          </p>
        </motion.div>

        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="text-center">
                {/* Profile Picture */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Globe className="h-8 w-8 text-purple-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-sm text-purple-400 mb-2">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`mailto:${member.email}`}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-16 text-gray-400"
        >
          <p>Built with ❤️ by the LoanSage Team</p>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} LoanSage. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;