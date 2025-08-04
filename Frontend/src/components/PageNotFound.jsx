import React from 'react';

function PageNotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50">
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full px-6 py-12">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-5xl py-16">
          <div className="text-[9rem] font-extrabold leading-none text-green-900">404</div>
          <div className="text-4xl font-semibold text-gray-800">Page Not Found</div>
          <p className="text-lg text-gray-600 max-w-2xl px-4 text-center">
            The page you’re looking for should be right here... but it’s gone missing. Let me take you back.
          </p>
          <button
            className="mt-4 px-10 py-3 rounded-full font-medium shadow-lg hover:scale-[1.02] transition-transform bg-green-700 text-white"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
