import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { openForm } = useContext(AuthContext);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const [activeId, setActiveId] = useState('home');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id);
  };

  return (
    <div className="backdrop-blur-2xl bg-[#08081e]/50">
      <nav className="flex justify-between items-center p-5 border-b border-gray-800">
        <div className="text-3xl font-black bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
          GenZChat
        </div>

        <div className="hidden md:block">
          <ul className="flex items-center gap-2">
            {navItems.map(({ id, label }) => {
              const active = activeId === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'px-4 py-2 rounded-3xl text-sm font-medium transition-colors',
                      active
                        ? 'text-white bg-[#08081e]/90'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    ].join(' ')}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          className="
            text-white px-6 py-2 rounded-3xl transition
            border border-gray-800/50 hover:border-white/70
            bg-gradient-to-r from-purple-500 to-blue-500
          "
          type="button"
          onClick={openForm}
        >
          Login
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
