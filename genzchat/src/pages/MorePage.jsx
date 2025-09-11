// src/pages/MorePage.jsx
import React, { useMemo, useRef, useState, useContext } from "react";
import { FiUser, FiZap, FiLogOut, FiEdit2, } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";


// If you really need Razorpay later, import and wire a handler. For now we keep it self-contained.
import Razorpay from "../trail/Razorpay";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import ChatPAge from "./ChatPage";


//
// Utility chips / cards / rows
//
const Chip = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

// Section container — solid dark, no glass
const SectionCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-[#111] border border-white/10 p-4 sm:p-5 ${className}`}>
    {children}
  </div>
);

// Row — solid dark, subtle border
const Row = ({ label, value, action }) => (
  <div className="flex items-center gap-3 justify-between px-3 sm:px-4 py-3">
    <div className="text-white/80 text-sm sm:text-[15px] font-medium">{label}</div>
    <div className="flex items-center gap-3">
      {typeof value === "string" ? (
        <div className="text-white/85 text-sm sm:text-[15px] select-text">{value}</div>
      ) : (
        value
      )}
      {action}
    </div>
  </div>
);

// Sidebar link
const SidebarLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition text-white/90 hover:bg-white/5 border border-transparent hover:border-white/10"
  >
    <span className="grid place-items-center w-6 h-6 rounded-full bg-white/10">{icon}</span>
    <span className="text-sm sm:text-[15px] font-semibold">{label}</span>
  </button>
);

const Divider = () => <div className="h-px bg-white/10 my-6" />;

export default function MorePage() {

  const { toggleSidebar } = useContext(ChatContext) || {};
  const { logout } = useContext(AuthContext) || {};

  // View state to switch between main "more" view and Razorpay upgrade view
  const [view, setView] = useState("more"); // "chat" | "more" | razorpay

  const openRazorpay = () => setView("razorpay");
  // ------- Mock data (replace with API/context) -------
  const user = {
    uid: "3172701",
    name: "Sagar",
    email: "hustler2k22@gmail.com",
    avatarUrl: "https://i.pravatar.cc/120?img=11",
    registeredAt: "2025-06-03",
    discordLinked: false,
  };

  const subscription = {
    planName: "Standard Plan",
    price: 27.99,
    interval: "month",
    renewalDate: "2025-10-05",
    status: "active",
  };

  const credits = {
    balance: 15,
    history: [
      { id: 1, date: "2025-09-01", change: +500, note: "Monthly top-up" },
      { id: 2, date: "2025-08-15", change: -120, note: "Image upscale x6" },
      { id: 3, date: "2025-08-10", change: -80, note: "Background removal" },
    ],
  };

  const invoices = [
    { id: "INV-14621", date: "2025-09-05", amount: 27.99, status: "paid" },
    { id: "INV-14388", date: "2025-08-05", amount: 27.99, status: "paid" },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  // Simple inline icon set (no external deps required)
  const I = useMemo(
    () => ({
      user: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      plan: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
      coins: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        </svg>
      ),
      invoice: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 3h10l4 4v14a2 2 0 01-2 2H7a2 2 0 012-2z" />
          <path d="M14 3v6h6" />
        </svg>
      ),
      help: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 115.8 1c0 2-3 2-3 4" />
          <circle cx="12" cy="17" r=".5" />
        </svg>
      ),
      bell: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2.9-.6 1.2L4 17h5" />
          <path d="M9 17a3 3 0 006 0" />
        </svg>
      ),
      back: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 font-extrabold" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      ),
      close: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      ),
      discord: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden fill="currentColor">
          <path d="M20 4a16 16 0 00-4-.9l-.2.4a13 13 0 00-7.6 0l-.2-.4A16 16 0 003.9 4C2 7.2 1.5 10.2 1.7 13.2A16 16 0 007 18.8a11 11 0 002.2-1.1 7 7 0 01-1.1-1.8c.4.3.9.6 1.4.8a9 9 0 004.7 0c.5-.2 1-.5 1.4-.8a7 7 0 01-1.1 1.8 11 11 0 002.2 1.1 16 16 0 005.3-5.6C22.5 10.2 22 7.2 20 4zM9.6 13.8c-.7 0-1.3-.7-1.3-1.6 0-.9.6-1.6 1.3-1.6s1.3.7 1.3 1.6zm4.8 0c-.7 0-1.3-.7-1.3-1.6 0-.9.6-1.6 1.3-1.6s1.3.7 1.3 1.6c0 .9-.6 1.6-1.3 1.6z" />
        </svg>
      ),
    }),
    []
  );

  // Refs for smooth-scrolling
  const personalRef = useRef(null);
  const subscriptionRef = useRef(null);
  const creditsRef = useRef(null);
  const invoiceRef = useRef(null);

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    const headerOffset = 125; // sticky header height
    const rect = ref.current.getBoundingClientRect();
    const top = window.scrollY + rect.top - headerOffset - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };
  if (view === "razorpay") {
    return <Razorpay onBack={() => setView("chat")} />; // show full-screen Razorpay page
  }
  if (view === "chat") {
    return <ChatPAge onBack={() => setView("chat")} />; // show full-screen Razorpay page
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Top header */}
      <header className="sticky top-0 z-30 backdrop-blur ">
        <div className=" top-0 inset-x-0 z-20 h-15  lg:h-20 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-15  bg-zinc-950/95 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-2xl md:text-4xl  font-bold tracking-tight bg-gradient-to-tr from-purple-400 to-blue-500 bg-clip-text text-transparent">
              GenZChat
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={openRazorpay}
              type="button"
              className="btn-aurora relative w-full overflow-hidden rounded-2xl p-[2px]"
            >
              <span className="relative z-[1] block w-full rounded-2xl px-4 py-2 text-sm font-medium text-white bg-black/80 hover:brightness-110">
                Upgrade
              </span>
            </button>
            <span
              className="inline-flex relative items-center justify-center w-8 h-8   transition-transform duration-300 hover:scale-110"
              title={`Credits: ${credits.balance}`}
              aria-label={`Credits: ${credits.balance}`}
            >
              <FiZap className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1 rounded-full bg-blue-600">
                {credits.balance}
              </span>
            </span>

            <button
              onClick={toggleSidebar}
              aria-label="Profile"
              className="p-2 rounded-full hover:bg-zinc-800 ring-1 ring-zinc-700/60 transition-transform duration-300 hover:scale-115"
              title="Profile"
            >
              <FiUser className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile sub-nav chips just below header */}
       <div className="md:hidden sticky top-1 z-20 bg-black/90 backdrop-blur">
  <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
    {/* Back icon button */}
    <button
      onClick={() => setView("chat")}
      className="shrink-0 flex items-center justify-center rounded-full w-8 h-8 text-gray-300 hover:bg-white/10"
    >
      <FaArrowLeft/>
    </button>

    <button
      onClick={() => scrollTo(personalRef)}
      className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 hover:bg-white/10"
    >
      Personal Info
    </button>
    <button
      onClick={() => scrollTo(subscriptionRef)}
      className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 hover:bg-white/10"
    >
      Subscription
    </button>
    <button
      onClick={() => scrollTo(creditsRef)}
      className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 hover:bg-white/10"
    >
      Credits
    </button>
  </div>
</div>

      </header>

      {/* Body */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid md:grid-cols-[260px_minmax(0,1fr)] gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:flex flex-col ">
            <div className="sticky top-30 space-y-2 overflow-y-hidden">
              {/* upar ke links */}
              <div className="space-y-2 mt-2">
                <SidebarLink icon={I.user} label="Personal Info" onClick={() => scrollTo(personalRef)} />
                <SidebarLink icon={I.plan} label="Subscription" onClick={() => scrollTo(subscriptionRef)} />
                <SidebarLink icon={I.coins} label="Credits" onClick={() => scrollTo(creditsRef)} />
                <SidebarLink icon={I.invoice} label="Invoice" onClick={() => scrollTo(invoiceRef)} />
              </div>

              {/* Back button */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <SidebarLink icon={I.back} label="Back" onClick={() => setView("chat")} />
              </div>

              {/* Logout button bilkul niche */}
              <div className="mt-auto pt-3 border-t border-white/10">
                <button>
                  <SidebarLink
                    icon={<FiLogOut />}
                    label="Logout"
                    onClick={logout}
                  />
                </button>
              </div>
            </div>
          </aside>



          {/* Main content */}
          <main>
            {/* Big header (desktop view) */}
            {/* <div className="hidden md:flex flex-col items-center mb-8">
              <img src={user.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full border-2 border-white/20" />
              <div className="mt-3 text-2xl font-bold">{user.name}</div>
              <div className="text-white/60">Domo UID: {user.uid}</div>
            </div> */}

            {/* PERSONAL INFO */}
            <section ref={personalRef} className="max-w-3xl mx-auto ">

              <div className="mb-6">
                <div className="flex items-center gap-4 mt-5">
                  <img src={user.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full border border-white/15" />
                  <div>
                    <div className="text-xl font-bold">{user.name}</div>
                    <div className="text-white/60 text-sm">Domo UID: {user.uid}</div>
                  </div>
                  <div className="ml-auto relative">
                    <button
                      onClick={() => {
                        setShowPopup(true);
                        setTimeout(() => setShowPopup(false), 2000); // 2 sec me hide
                      }}
                      onMouseEnter={() => setShowPopup(true)}
                      onMouseLeave={() => setShowPopup(false)}
                      className="rounded-md px-1 py-1 text-sm font-semibold bg-white/10 border border-white/15 hover:bg-white/15"
                    >
                      <FiEdit2 size={20} className="h-4 w-4" />
                    </button>

                    {showPopup && (
                      <div className="absolute right-0 top-9 min-w-[180px] max-w-[220px] bg-zinc-800 text-white text-[11px] px-4.5 py-1 rounded-md border border-white/10 shadow-md animate-fade">
                        Can't change before 15 days
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Personal Info</h2>
              <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
              <div className="space-y-3 mb-6  rounded-xl bg-[#121212] border border-white/10">
                <Row label="Registration date" value={user.registeredAt} />
                <hr className="text-gray-400/60" />
                <Row label="Username" value={user.name} />
              </div>

              <h3 className="text-lg font-semibold mb-3">Linking account</h3>
              <div className="space-y-3  rounded-xl bg-[#121212] border border-white/10">
                <Row
                  label="Discord ID"
                  value={<span className="text-white/70">{user.discordLinked ? "Connected" : "Not connected"}</span>}
                  action={
                    <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-sm font-semibold">
                      <span className="text-indigo-300">{I.discord}</span>
                      {user.discordLinked ? "Manage" : "Connect Discord"}
                    </button>
                  }
                /> <hr className="text-gray-400/60" />
                <Row label="Gmail" value={user.email} />
              </div>
            </section>

            {/* SUBSCRIPTION */}
            <section ref={subscriptionRef} className="max-w-3xl mx-auto mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Subscription</h2>

              <SectionCard>
                <div className="space-y-4">
                  <div className="rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-white/90 font-semibold text-lg">
                        ${subscription.price.toFixed(2)} / {subscription.interval}
                      </div>
                      <div className="text-white/60">{subscription.planName}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={openRazorpay}
                        type="button"
                        className="btn-aurora relative w-full overflow-hidden rounded-2xl p-[2px]"
                      >
                        <span className="relative z-[1] block w-full rounded-2xl px-4 py-2 text-sm font-medium text-white bg-black/80 hover:brightness-110">
                          Upgrade
                        </span>
                      </button>
                    </div>
                  </div>
                  <hr className="text-gray-400/60" />
                  <div className="rounded-2xl  px-4 py-3 text-sm text-white/80">
                    Renewal at <span className="font-semibold">{subscription.renewalDate}</span>
                  </div>
                </div>
              </SectionCard>
            </section>

            {/* CREDITS */}
            <section ref={creditsRef} className="max-w-3xl mx-auto mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Credits</h2>

              <SectionCard>
                <div className="flex items-center gap-3">
                  <Chip className="bg-yellow-500/10 text-yellow-300 border border-yellow-400/20">
                    {I.coins}
                    <span className="ml-1">{credits.balance}</span>
                  </Chip>
                  <button className="rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 px-3 py-2 text-sm">
                    Buy more
                  </button>
                </div>

                <Divider />

                <div className="space-y-2">
                  {credits.history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-xl bg-[#121212] border border-white/10 px-3 py-2"
                    >
                      <div className="text-white/70 text-sm">{h.date}</div>
                      <div className={`text-sm font-semibold ${h.change > 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        {h.change > 0 ? "+" : ""}
                        {h.change}
                      </div>
                      <div className="text-white/70 text-sm">{h.note}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
              {/* Back button */}
              {/* <div className="mt-4 pt-3 border-t border-white/10">
              <SidebarLink icon={I.back} label="Back" onClick={() => window.history.back()} />
            </div> */}

              {/* Logout button bilkul niche */}
              <div className="sm:hidden mt-auto pt-3 border-t border-white/10">
                <SidebarLink
                  icon={<FiLogOut />}
                  label="Logout"
                  onClick={logout}
                />
              </div>
            </section>

            {/* INVOICE */}
            {/* <section ref={invoiceRef} className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Invoice</h2>

              <SectionCard>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-white/60">
                        <th className="py-3 pr-4">Invoice</th>
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 pr-4">Amount</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-0 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-t border-white/10">
                          <td className="py-3 pr-4">{inv.id}</td>
                          <td className="py-3 pr-4">{inv.date}</td>
                          <td className="py-3 pr-4">${inv.amount.toFixed(2)}</td>
                          <td className="py-3 pr-4">
                            <Chip
                              className={`${inv.status === "paid"
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20"
                                  : "bg-amber-500/10 text-amber-300 border border-amber-400/20"
                                }`}
                            >
                              {inv.status}
                            </Chip>
                          </td>
                          <td className="py-3 pr-0 text-right">
                            <button className="rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 px-3 py-1.5">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </section> */}
          </main>
        </div>
      </div>

      {/* Optional mobile drawer — kept if you want a slide-out nav. Not required since we added chips under header. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-black border-r border-white/10 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
                <span className="font-black tracking-tight">DomoAI</span>
              </div>
              <button
                className="p-2 rounded-xl bg-white/5 border border-white/10"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                {I.close}
              </button>
            </div>

            <SidebarLink
              icon={I.user}
              label="Personal Info"
              onClick={() => {
                setDrawerOpen(false);
                setTimeout(() => scrollTo(personalRef), 50);
              }}
            />
            <SidebarLink
              icon={I.plan}
              label="Subscription"
              onClick={() => {
                setDrawerOpen(false);
                setTimeout(() => scrollTo(subscriptionRef), 50);
              }}
            />
            <SidebarLink
              icon={I.coins}
              label="Credits"
              onClick={() => {
                setDrawerOpen(false);
                setTimeout(() => scrollTo(creditsRef), 50);
              }}
            />
            <SidebarLink
              icon={I.invoice}
              label="Invoice"
              onClick={() => {
                setDrawerOpen(false);
                setTimeout(() => scrollTo(invoiceRef), 50);
              }}
            />


            <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
              <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
              <div>
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-white/60">UID: {user.uid}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}