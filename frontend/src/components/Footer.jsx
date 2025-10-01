import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Store</h3>
            <p className="text-gray-600 text-sm">
              Your one-stop shop for quality products at amazing prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-black">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-black">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-black">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {currentYear} Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;