import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceAuthBanner from '../assets/FaceAuthBanner.svg';
import { IoIosInformationCircleOutline, IoIosReverseCamera } from "react-icons/io";
import ProceedButton from '../components/ProceedButton';
import FaceImg from "../assets/FaceImg.png"
import verification from "../assets/verification.gif"

const AuthModePage = () => {
  const [authMode, setAuthMode] = useState('face'); 
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  // Auto-simulate the capture verification after 2 seconds
  useEffect(() => {
    let verifyTimer;
    let navigateTimer;
    
    if (isCapturing) {
      verifyTimer = setTimeout(() => {
        setIsVerifying(true);
        
        // Navigate after showing success message for 1.5 seconds
        navigateTimer = setTimeout(() => {
          navigate('/aadhaar-details');
        }, 1500);
      }, 2000);
    }
    
    return () => {
      clearTimeout(verifyTimer);
      clearTimeout(navigateTimer);
    };
  }, [isCapturing, navigate]);

  return (
    <div className="w-full flex-col px-4 md:px-8 py-10 items-center justify-center flex text-black animate-in fade-in duration-500">
      
      <h2 className="font-bold text-xl md:text-[22px] tracking-tight mb-5 text-center">
        Please select an authentication mode:
      </h2>
      
      <div className="flex gap-4 mb-10">
          <button 
            className={`px-8 py-1.5 rounded-full border border-black font-semibold transition-colors ${authMode === 'face' ? 'bg-primary border-transparent shadow-sm' : 'bg-transparent'}`}
            onClick={() => setAuthMode('face')}
          >
            Face Scan
          </button>
          <button 
            className={`px-8 py-1.5 rounded-full border border-black font-semibold transition-colors ${authMode === 'fingerprint' ? 'bg-primary border-transparent shadow-sm' : 'bg-transparent'}`}
            onClick={() => setAuthMode('fingerprint')}
          >
            Fingerprint
          </button>
      </div>

      {!isCapturing ? (
        <div className="w-full rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm relative min-h-95">
          <div className="absolute inset-0 z-0">
            <img src={FaceAuthBanner} alt="banner" className="w-full h-full object-cover" />
          </div>
          
          {/* Left Side: Text and Button */}
          <div className="flex flex-col justify-center flex-1 z-10 text-black px-8 md:pl-20 py-10">
            <h1 className="text-3xl md:text-[44px] tracking-tight font-bold mb-2 leading-tight">Face Authentication</h1>
            <p className="text-md md:text-[18px] font-medium mb-12 tracking-tight opacity-90">*Please ensure your face is properly aligned with the webcam.</p>
            
            <ProceedButton 
              text="CAPTURE"
              onClick={() => setIsCapturing(true)}
              className="w-fit"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
          <h1 className="text-2xl md:text-[26px] font-bold mb-3 tracking-tight">Face Authentication</h1>
          <p className="text-[17px] mb-8">*Please place your face towards the webcam.</p>

          <div className="w-full max-w-212.5 aspect-video md:h-120 rounded-3xl relative overflow-hidden bg-[#90959c] flex items-center justify-center shadow-md">
            
            <div className="absolute top-6 left-6 text-white cursor-pointer group z-20">
              <div className="hover:opacity-80 transition-opacity">
                <IoIosInformationCircleOutline size={30} />
              </div>
              
              {/* Tooltip visible on hover */}
              <div className="absolute top-full left-0 mt-3 w-56 md:w-80 bg-white text-black p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-left">
                <h4 className="font-bold text-[15px] mb-2 text-gray-800">Tips for Best Scan</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-[1px] md:text-sm text-gray-600 font-medium tracking-tight">
                  <li>Center your face in the frame</li>
                  <li>Ensure proper lighting</li>
                  <li>Remove mask/cap/sunglasses</li>
                  <li>Look straight & keep a netural expression</li>
                  <li>Stay still for a few seconds</li>
                </ul>
              </div>
            </div>

            <div className="absolute top-6 right-6 text-white cursor-pointer hover:opacity-80">
            <IoIosReverseCamera size={40} />
            </div>

            {/* Camera Viewport Circle */}
            <div className="relative w-75 h-75 md:w-85 md:h-85 rounded-full bg-[#3b4148] shadow-inner flex items-center justify-center overflow-hidden">
               <img src={FaceImg} alt="Person image" className={`w-full h-full object-cover transition-all duration-700 ${isVerifying ? 'blur-sm scale-105 opacity-80' : ''}`} />
               
               {/* Scanning frame brackets centered INSIDE the circle tighter around the face */}
               {!isVerifying && (
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 pointer-events-none z-10 transition-all duration-300">
                   <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white animate-pulse"></div>
                   <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white animate-pulse"></div>
                   <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white animate-pulse"></div>
                   <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white animate-pulse"></div>
                 </div>
               )}

               {isVerifying && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 animate-in fade-in duration-300">
                   <img src={verification} alt="verification" className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl" />
                   <p className='text-white font-bold'>Face Verified Sucessfully</p>
                 </div>
               )}
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default AuthModePage;
