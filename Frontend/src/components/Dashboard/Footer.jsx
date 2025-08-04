export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white border-t border-indigo-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} Task Tracker App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}