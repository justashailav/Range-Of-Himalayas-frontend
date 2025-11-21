import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { IoLocationSharp, IoMailSharp, IoTimeSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-[#f8faf8] text-gray-800 border-t border-gray-200 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div>
              <h3 className="text-xl font-semibold text-[#1A3C34]">
                Range of Himalayas
              </h3>
              <p className="text-sm text-green-700 font-medium">
                Fresh from the Himalayas
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Premium apples and kiwis grown naturally in the pristine valleys of
            Himachal Pradesh. From our orchards to your table, we deliver
            freshness across India.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a href="/about-us" className="hover:text-green-700">
                Our Story
              </a>
            </li>
            <li>
              <a href="/custombox" className="hover:text-green-700">
                Create Box
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-green-700">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a href="/faqs" className="hover:text-green-700">
                FAQ
              </a>
            </li>
            <li>
              <a href="/shipping-policy" className="hover:text-green-700">
                Shipping
              </a>
            </li>
            <li>
              <a href="/return-policy" className="hover:text-green-700">
                Return & refund
              </a>
            </li>
            <li>
              <a href="/contact-us" className="hover:text-green-700">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-green-700">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <IoLocationSharp className="text-green-700  mt-0.5" />
              <span>
                Village Bareon, Tehsil Kotkhai, District Shimla(HP), India - 17204
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-green-700" />
              <a href="tel:+916230867344" className="hover:text-green-700">
                +91 62308 67344
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoMailSharp className="text-green-700" />
              <a
                href="mailto:contactrangeofhimalayas@gmail.com"
                className="hover:text-green-700"
              >
                contactrangeofhimalayas@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoTimeSharp className="text-green-700" />
              <span>Mon–Sat: 9 AM – 6 PM</span>
            </li>
          </ul>
          <div className="mt-4">
            <h5 className="font-medium mb-2">Follow Us</h5>
            <div className="flex items-center gap-3 text-xl">
              <a
                href="https://www.instagram.com/range.of.himalayas"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-700"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/share/1L1TZdfp8J/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-700"
              >
                <FaFacebook />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb7Bkv84SpkMGym1LW2V"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-700"
              >
                <FaWhatsapp/>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        © {new Date().getFullYear()} Range of Himalayas. All rights reserved.
      </div>
    </footer>
  );
}
