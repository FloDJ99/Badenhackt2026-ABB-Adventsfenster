import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Star } from 'lucide-react';

// Array of 10 images that will rotate every 5 minutes for door 5
// Place your images in the /public/img/ directory
const base = import.meta.env.BASE_URL;
const images = [
  `${base}img/image1.png`,
  `${base}img/image2.png`,
  `${base}img/image3.png`,
  `${base}img/image4.png`,
  `${base}img/image5.png`,
];


// Scrambled order typical for advent calendars
const displayOrder = [
  17, 4, 21, 9, 2, 14, 
  24, 7, 11, 19, 1, 15, 
  8, 22, 5, 13, 20, 3, 
  10, 18, 6, 23, 12, 16
];

// Festive Snowflakes Component
const Snowflakes = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="snowflake"
        style={{
          width: `${Math.random() * 0.4 + 0.2}rem`,
          height: `${Math.random() * 0.4 + 0.2}rem`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.2
        }}
      />
    ))}
  </div>
);

const SantaSleigh = () => (
  <div className="sleigh-animation drop-shadow-2xl flex items-end" aria-hidden="true">
    {/* 
      Tipp: Für einen komplett fotorealistischen Schlitten kannst du die Emojis hier 
      durch ein echtes Bild (z.B. ein transparentes PNG) ersetzen:
      <img src="/assets/realistischer-schlitten.png" alt="Santa" className="w-64 md:w-96" />
    */}
    <div className="flex text-5xl md:text-7xl">
      <span className="reindeer" style={{ animationDelay: '0s' }}>🦌</span>
      <span className="reindeer" style={{ animationDelay: '0.15s' }}>🦌</span>
      <span className="reindeer mr-1 md:mr-2" style={{ animationDelay: '0.3s' }}>🦌</span>
    </div>
    <div className="relative text-5xl md:text-7xl">
      {/* Santa is positioned absolutely to sit "inside" the sleigh */}
      <span className="absolute bottom-3 md:bottom-5 right-0 md:-right-1 text-4xl md:text-5xl z-0">🎅</span>
      <span className="relative z-10">🛷</span>
    </div>
  </div>
);

export default function App() {
  const [showStartPage, setShowStartPage] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(images.length - 1);
  const [animatingDoor, setAnimatingDoor] = useState<number | null>(null);

  const handleOpenDoor = useCallback((dayNumber: number) => {
    if (dayNumber === 5) {
      setAnimatingDoor(5);
      setTimeout(() => {
        setCurrentContentIndex((prev) => (prev + 1) % images.length);
        setSelectedDay(dayNumber);
        setAnimatingDoor(null);
      }, 1500);
    } else {
      setSelectedDay(dayNumber);
    }
  }, [images.length]);

  // Auto-restart the loop 20 seconds after the door is opened
  useEffect(() => {
    if (selectedDay === 5) {
      const timer = setTimeout(() => {
        setSelectedDay(null);
        setShowStartPage(true);
      }, 20 * 1000); 
      return () => clearTimeout(timer);
    }
  }, [selectedDay]);

  // Auto-transition from start page to calendar after 10 seconds
  useEffect(() => {
    if (showStartPage) {
      const timer = setTimeout(() => {
        setShowStartPage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showStartPage]);

  // Auto-open door 5 after 10 seconds on the calendar view
  useEffect(() => {
    if (!showStartPage && selectedDay === null && animatingDoor === null) {
      const timer = setTimeout(() => {
        handleOpenDoor(5);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showStartPage, selectedDay, animatingDoor, handleOpenDoor]);

  const currentImageUrl = images[currentContentIndex];

  if (showStartPage) {
    return (
      <div 
  className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900"
  style={{
    backgroundImage: `url("${import.meta.env.BASE_URL}img/start-bg.png")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
      >
        {/* Dark overlay to make the button stand out more if needed */}
        <div className="absolute inset-0 bg-black/30" />
        
        <Snowflakes />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-900 via-abb-dark to-slate-900 relative overflow-hidden">
      <Snowflakes />
      <SantaSleigh />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="max-w-6xl mx-auto mb-12 text-center pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="text-yellow-400 w-8 h-8 md:w-10 md:h-10 fill-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-lg">
              <span className="text-abb-red">ABB</span> Technikerschule
            </h1>
            <Star className="text-yellow-400 w-8 h-8 md:w-10 md:h-10 fill-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-gray-200 tracking-wide drop-shadow-md">
            Adventskalender
          </h2>
        </header>

        {/* Calendar Grid */}
        <main className="max-w-5xl mx-auto pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {displayOrder.map((dayNumber) => {
              const isClickable = dayNumber === 5;
              
              return (
                <motion.div
                  key={dayNumber}
                  layoutId={`door-${dayNumber}`}
                  onClick={() => isClickable && handleOpenDoor(dayNumber)}
                  className={`aspect-square bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden ${
                    isClickable 
                      ? 'hover:border-abb-red hover:shadow-abb-red/30 hover:shadow-2xl cursor-pointer group transition-all' 
                      : 'opacity-90 cursor-default'
                  }`}
                  animate={animatingDoor === dayNumber ? {
                    scale: [1, 1.1, 1.1, 1.1, 1],
                    rotate: [0, -10, 10, -10, 10, -5, 5, 0],
                    boxShadow: ["0px 0px 0px rgba(227,0,15,0)", "0px 0px 30px rgba(227,0,15,0.8)", "0px 0px 0px rgba(227,0,15,0)"]
                  } : {}}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  whileHover={isClickable && animatingDoor !== dayNumber ? { scale: 1.05, rotate: Math.random() * 4 - 2 } : {}}
                  whileTap={isClickable && animatingDoor !== dayNumber ? { scale: 0.95 } : {}}
                >
                  {/* Festive corner accent */}
                  {isClickable && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-red-50 opacity-50 pointer-events-none" />
                  )}
                  
                  <span className={`text-4xl md:text-5xl font-bold text-abb-dark drop-shadow-sm font-serif ${isClickable ? 'group-hover:text-abb-red transition-colors' : ''}`}>
                    {dayNumber}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Zoom-in Modal Overlay */}
      <AnimatePresence>
        {selectedDay === 5 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-abb-dark/90 backdrop-blur-md z-40"
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8 pointer-events-none">
              <motion.div
                layoutId={`door-${selectedDay}`}
                className="bg-white w-auto max-w-[95vw] h-auto max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border-4 border-abb-red"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-abb-red text-white flex items-center justify-center font-bold text-xl shadow-inner">
                      {selectedDay}
                    </div>
                    <h3 className="text-xl font-bold text-abb-dark font-serif">
                      Türchen {selectedDay}: Bitte QR-Code im Bild scannen!
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 text-gray-400 hover:text-abb-red hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Schließen"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Modal Body (Image) */}
                <div className="flex-1 w-auto h-auto bg-gray-50 relative flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={currentImageUrl}
                    alt={`Inhalt für Türchen ${selectedDay}`}
                    className="max-w-full max-h-[calc(95vh-120px)] object-contain rounded-lg shadow-sm"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image is missing
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/abb${currentContentIndex}/800/600`;
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
