export function Navbar() {
  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <img 
            src="/OODC logo.png"
            alt="Dashboard Logo"
            className="h-6 w-auto"
          />
          <span className="ml-2 font-bold">DASHBOARD</span>
        </div>

        {/* Right side - Icons with darker styling */}
        <div className="flex items-center gap-5">
          {/* Search Bar - Darker version */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-1.5 text-sm rounded-full border border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
            />
            <svg
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Mobile Search Icon - Darker */}
          <svg
            className="h-5 w-5 text-gray-600 md:hidden hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Settings Icon - Darker */}
          <svg
            className="h-5 w-5 text-gray-600 hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          {/* Notification Icon - Darker with badge */}
          <div className="relative">
            <svg
              className="h-5 w-5 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
          </div>
        </div>
      </div>
    </header>
  );
}