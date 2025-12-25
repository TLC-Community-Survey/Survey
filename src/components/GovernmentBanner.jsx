import React from 'react'

function GovernmentBanner() {
  return (
    <div className="relative w-full bg-gradient-to-b from-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Official Banner Stripes */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
      
      {/* Background Image with Overlay */}
      <div className="relative">
        <div 
          className="w-full h-64 md:h-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/caretaker-banner.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="notion-content w-full py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Official Badge/Seal Area */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18L20 8v9.82c0 4.12-2.8 8.1-8 9.18-5.2-1.08-8-5.06-8-9.18V8l8-3.82z"/>
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Title and Subtitle */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2">
                    <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-blue-300">
                      Community Performance Survey
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">
                    <span className="text-white">THE LAST</span>
                    <br />
                    <span className="text-orange-400">CARETAKER</span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium">
                    CU1 Update Performance & Stability Assessment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>
    </div>
  )
}

export default GovernmentBanner

