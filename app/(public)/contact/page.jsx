'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#3A3634] py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-[#7C2A47] mb-4">
          Contact <span className="text-[#E6A02A]">Us</span>
        </h1>
        <p className="text-lg mb-12">
          Have a question or need assistance? We’re here to help you find the best pumping solution.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg p-6 rounded-2xl border-t-4 border-[#7C2A47]">
            <Phone className="mx-auto text-[#E6A02A] mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl border-t-4 border-[#7C2A47]">
            <Mail className="mx-auto text-[#E6A02A] mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p>info@senbapumps.com</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl border-t-4 border-[#7C2A47]">
            <MapPin className="mx-auto text-[#E6A02A] mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p>123 Industrial Road, Coimbatore, Tamil Nadu</p>
          </div>
        </div>

        <form className="mt-16 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#7C2A47]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#7C2A47]"
            />
          </div>
          <textarea
            placeholder="Your Message"
            rows="5"
            className="border border-gray-300 rounded-lg p-3 mt-4 w-full focus:outline-none focus:border-[#7C2A47]"
          ></textarea>
          <button
            type="submit"
            className="mt-6 bg-[#7C2A47] hover:bg-[#E6A02A] transition text-white px-8 py-3 rounded-lg font-semibold"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </div>
  );
}
