import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import logo from '../assets/icons/logo.png'


const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
  <img src={logo} alt="" className="w-[150px] m-auto mb-8"/>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Discover apartments, shortlets, and properties for rent or sale
            across Nigeria with ease and confidence.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-3 mt-5">
            <a className="p-2 bg-purple-50 rounded-lg hover:bg-purple-600 hover:text-white transition">
              <Facebook size={16} />
            </a>
            <a className="p-2 bg-purple-50 rounded-lg hover:bg-purple-600 hover:text-white transition">
              <Instagram size={16} />
            </a>
            <a className="p-2 bg-purple-50 rounded-lg hover:bg-purple-600 hover:text-white transition">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>

          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-purple-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/property" className="hover:text-purple-600">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/create-listing" className="hover:text-purple-600">
                Post Property
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-purple-600">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* PROPERTY TYPES */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Property Types</h3>

          <ul className="space-y-2 text-sm text-gray-500">
            <li className="hover:text-purple-600 cursor-pointer">Apartments</li>
            <li className="hover:text-purple-600 cursor-pointer">Shortlets</li>
            <li className="hover:text-purple-600 cursor-pointer">Houses</li>
            <li className="hover:text-purple-600 cursor-pointer">Commercial</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>

          <div className="space-y-3 text-sm text-gray-500">

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              <span>Lagos, Nigeria</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-purple-600" />
              <span>+234 800 000 0000</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-purple-600" />
              <span>support@rentbeta.com</span>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-purple-600 font-semibold">RentBeta</span>. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;