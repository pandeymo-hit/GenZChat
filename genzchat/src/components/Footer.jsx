import React, { useContext } from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
const Footer = () => {

  const { openForm } = useContext(AuthContext);

  const year = new Date().getFullYear();

  return (
    <footer className="px-2 py-10">
      <div className="max-w-6xl mx-auto border border-white/10 bg-[#0b0b16]/10 backdrop-blur-xl p-6 md:p-8 
     shadow-[inset_20px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.05)] rounded-2xl">

        {/* <div className="max-w-6xl mx-auto border border-white/10 bg-[#0b0b16]/10 backdrop-blur-xl p-6 md:p-8"> */}
        {/* 1 → 2 → 3 columns, equal spacing on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Brand + blurb */}
          <div>
            <a href="/" className="text-white text-xl font-bold tracking-tight">GenzChat</a>
            <p className="mt-3 text-sm text-gray-400">Meaningful conversations, made simple.</p>
            <div className="mt-4 flex items-center gap-3 text-lg">
              <a className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition" href="#" aria-label="Instagram"><FaInstagram /></a>
              <a className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition" href="#" aria-label="Facebook"><FaFacebook /></a>
              <a className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition" href="#" aria-label="Twitter"><FaTwitter /></a>
              <a className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition" href="#" aria-label="YouTube"><FaYoutube /></a>
              <a className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition" href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Useful Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a className="hover:text-white transition" href="#">Legal & Privacy</a></li>
              <li><a className="hover:text-white transition" href="#">Contact</a></li>
            </ul>
          </div>

          {/* Subscribe → CTA button */}
          <div>
            <h3 className="text-white font-semibold mb-3">Subscribe Newsletter</h3>
            <p className="text-sm text-gray-400 mb-2">Get the latest updates and tips.</p>
            <button
              type="button"
              onClick={() => openForm("signup")}
              className="btn-aurora relative flex items-center justify-center overflow-hidden rounded-[100px] p-[2px] border-0"
            >
              <span className="btn-aurora__inner relative z-[1] rounded-[100px] px-6 py-2 text-white text-sm font-medium bg-black/75 backdrop-blur-xl">
                Sign up
              </span>
            </button>
          </div>
        </div>

        {/* bottom line */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-xs text-gray-500">© {year}All rights reserved || GenzChat Labs Pvt Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
