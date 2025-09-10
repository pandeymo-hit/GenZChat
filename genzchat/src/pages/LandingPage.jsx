import React , { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import MainSection from '../components/MainSection';
import Footer from '../components/Footer';
import LanguageSection from '../components/LanguageSection';
import Stats from '../components/Stats';
import WhyUs from '../components/WhyUs';
import LoginPage from '../pages/LoginPage';
import SocialMedia from '../components/SocialMedia';
import CTASection from '../components/CTASection';
import ChatSuggestions from '../components/ChatSuggestions';
import MockUp from '../components/MockUp';
import CommunitySection from '../components/CommunitySection';

const LandingPage = () => {

   const { showForm } = useContext(AuthContext);   // <- yahin se gate karenge

  // ✅ Jab form open ho to sirf auth page dikhao
  if (showForm) {
    return <LoginPage />;
  }
  return (
    <div className=''>
       <NavBar/>
       {/* <LoginPage/>  */}
       <MainSection/>
       <SocialMedia/>
       <MockUp/>
       <WhyUs/>
       <LanguageSection/>
       {/* <ChatSuggestions/> */}
       <Stats/>
       <CommunitySection/>
       <CTASection/>
       <Footer/>

    </div>
  )
}

export default LandingPage