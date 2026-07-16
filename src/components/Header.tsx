/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, ShieldAlert, LogIn, LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminUser: any | null;
  onAdminClick: () => void;
  onLogoutClick: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  adminUser,
  onAdminClick,
  onLogoutClick,
  selectedCategory,
  setSelectedCategory
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm" id="store-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            id="logo-container"
          >
            {/* Styled custom play store triangle */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow-sm">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E676" />
                    <stop offset="100%" stopColor="#00B0FF" />
                  </linearGradient>
                </defs>
                <polygon points="10,5 90,50 10,95" fill="url(#g1)" />
                <polygon points="10,5 50,50 10,50" fill="#00C853" opacity="0.15" />
                <polygon points="10,95 50,50 10,50" fill="#0091EA" opacity="0.15" />
              </svg>
            </div>
            <span className="font-sans font-bold text-xl text-gray-800 tracking-tight hidden sm:inline-block">
              Myselfmk <span className="text-[#01875f]">Appstore</span>
            </span>
            <span className="font-sans font-bold text-lg text-[#01875f] sm:hidden">
              MKstore
            </span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl" id="search-container">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'home') {
                    setActiveTab('home');
                  }
                }}
                placeholder="Search apps, games, utilities..."
                className="block w-full pl-10 pr-4 py-2 border-none bg-gray-50 focus:bg-white text-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#01875f] focus:ring-offset-0 transition-colors placeholder-gray-400 shadow-inner"
                id="search-input"
              />
            </div>
          </div>

          {/* Right Menu Controls */}
          <div className="flex items-center gap-3 shrink-0" id="user-actions">
            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#01875f]/10 text-[#01875f] border-[#01875f]/20'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                  }`}
                  id="admin-active-btn"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Admin Desk
                </button>
                <button
                  onClick={onLogoutClick}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                  title="Logout Admin"
                  id="logout-btn"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors font-medium"
                id="login-btn"
              >
                <LogIn className="w-4 h-4 text-gray-500" />
                <span className="hidden md:inline">Admin Access</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white border-t border-gray-100" id="sub-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12 overflow-x-auto no-scrollbar scroll-smooth items-center">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                activeTab === 'home' && selectedCategory === 'All' && searchQuery === ''
                  ? 'border-[#01875f] text-[#01875f] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="nav-home"
            >
              For you
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('Games');
              }}
              className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                activeTab === 'home' && selectedCategory === 'Games'
                  ? 'border-[#01875f] text-[#01875f] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="nav-games"
            >
              Games
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('Productivity');
              }}
              className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                activeTab === 'home' && selectedCategory === 'Productivity'
                  ? 'border-[#01875f] text-[#01875f] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="nav-productivity"
            >
              Productivity
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('Health & Fitness');
              }}
              className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                activeTab === 'home' && selectedCategory === 'Health & Fitness'
                  ? 'border-[#01875f] text-[#01875f] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="nav-health"
            >
              Health
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('Music & Audio');
              }}
              className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                activeTab === 'home' && selectedCategory === 'Music & Audio'
                  ? 'border-[#01875f] text-[#01875f] font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="nav-music"
            >
              Audio
            </button>
            {adminUser && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`pb-3 pt-3 px-1 border-b-2 text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'admin'
                    ? 'border-[#01875f] text-[#01875f] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                id="nav-admin"
              >
                Admin console
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
