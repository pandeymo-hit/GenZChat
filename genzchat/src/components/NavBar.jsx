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
    <div className="backdrop-blur-2xl ">
      <nav className="flex justify-between items-center p-3 md:p-5 bg-black/80 shadow-[0_0_10px_rgba(139,92,246,0.5)] ">
        <div className="text-2xl font-black bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
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

        {/* <button
          className="
            text-white px-6 py-2 rounded-3xl transition
            border border-gray-800/50 hover:border-white/70
            bg-gradient-to-r from-purple-500 to-blue-500
          "
          type="button"
          onClick={openForm}
        >
          Login
        </button> */}
        <button
  type="button"
  onClick={openForm}
  className="btn-aurora relative flex items-center justify-center overflow-hidden rounded-[100px] p-[2px] border-0"
>
  <span className="btn-aurora__inner relative z-[1] rounded-[100px] px-6 py-2 text-white text-sm font-medium bg-black/75 backdrop-blur-xl">
    Login
  </span>
</button>
      </nav>
    </div>
  );
};

export default NavBar;
