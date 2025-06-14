import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="w-full bg-gradient-to-b from-[#0055d2] to-[#4da5ff] fixed top-0 left-0 shadow-sm z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Menu Icon */}
          <div className="flex items-center gap-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group flex items-center -ml-2 hover:bg-transparent"
                  style={{background: 'none'}}
                >
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>

              {/* Sidebar */}
              <SheetContent side="left" className="p-0 w-48 [&>button]:hidden">
                <Card className="h-full rounded-none border-r-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <img
                      src="/OODC logo.png"
                      alt="Company Logo"
                      className="h-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-gray-600 hover:text-[#0055d2]"
                      style={{background: 'none'}}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                  
                  <div className="p-4 mt-10 flex flex-col gap-6 pl-7">
                    {[
                      { icon: 'M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z', label: 'Dashboard' },
                      { icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', label: 'Applicants' },
                      { icon: 'M4 7V6a2 2 0 012-2h3V3h6v1h3a2 2 0 012 2v1M4 7h16M4 7v11a2 2 0 002 2h12a2 2 0 002-2V7', label: 'Positions' },
                      { icon: 'M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z', label: 'Library' }
                    ].map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="flex items-center gap-3 text-gray-600 hover:text-[#0055d2] px-2 py-1 rounded justify-start"
                        style={{background: 'none'}}
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className="text-base font-medium">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search, Settings, Notification */}
          <div className="flex items-center gap-5">
            {/* Search bar */}
            <div className="relative hidden md:block w-72">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 rounded-full bg-white placeholder-gray-500 focus-visible:ring-white"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Icons */}
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-transparent hover:text-gray-200" style={{background: 'none'}}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-transparent hover:text-gray-200" style={{background: 'none'}}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>

            <div className="relative">
              <Button variant="ghost" size="icon" className="text-white hover:bg-transparent hover:text-gray-200" style={{background: 'none'}}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Button>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
            </div>
          </div>
        </div>

        {/* Logo and Title */}
        <div className="bg-white h-24 flex items-center px-6 shadow-md">
          <img src="/OODC logo.png" alt="Company Logo" className="h-14 w-auto mr-4 ml-7" />
          <span className="font-semibold text-gray-700 text-2xl" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            DASHBOARD
          </span>
        </div>
      </header>
    </>
  );
}