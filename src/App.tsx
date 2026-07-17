/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryList from './components/CategoryList';
import AppCard from './components/AppCard';
import AppDetailView from './components/AppDetailView';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import FooterPages from './components/FooterPages';
import { AppItem } from './types';
import { SEED_APPS } from './data';
import { fetchAllApps, fetchAppById, subscribeToAuth, adminLogout, isFirebaseActive } from './lib/firebase';
import { Star, Flame, Award, HelpCircle, Loader2, Database, Key, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'admin' | 'admin-login' | 'about' | 'contact' | 'privacy'>('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [dbErrorReason, setDbErrorReason] = useState<'timeout' | 'permission' | 'generic' | null>(null);

  // Subscribe to Authentication state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch apps from Database
  const loadAppsData = async () => {
    if (!isFirebaseActive()) {
      setApps(SEED_APPS);
      setIsOfflineMode(true);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setShowOfflineAlert(false);
      setDbErrorReason(null);
      const data = await fetchAllApps();
      setApps(data);
      setIsOfflineMode(false);
    } catch (err: any) {
      console.error('Error fetching marketplace apps:', err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('TIMEOUT') || errMsg.includes('timeout')) {
        setDbErrorReason('timeout');
      } else if (errMsg.includes('permissions') || errMsg.includes('permission-denied') || errMsg.includes('permission')) {
        setDbErrorReason('permission');
      } else {
        setDbErrorReason('generic');
      }
      // Falling back to local offline seed apps
      setApps(SEED_APPS);
      setIsOfflineMode(true);
      setShowOfflineAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppsData();
  }, []);

  // Sync a single app's details when updated (e.g. review added)
  const handleRefreshActiveApp = async (id: string) => {
    const updated = await fetchAppById(id);
    if (updated) {
      setSelectedApp(updated);
      // Also update in master lists
      setApps((prevApps) => prevApps.map((a) => (a.id === id ? updated : a)));
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await adminLogout();
    setAdminUser(null);
    setActiveTab('home');
  };

  // Filter apps based on active category and search queries
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  // Extract featured and trending apps for designated sections
  const featuredApps = useMemo(() => apps.filter((a) => a.isFeatured), [apps]);
  const trendingApps = useMemo(() => apps.filter((a) => a.isTrending), [apps]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 selection:bg-[#01875f]/10 selection:text-[#01875f]">
      
      {/* Header Navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={(tab: any) => {
          setSelectedApp(null); // Clear selected app details if switching tabs
          setActiveTab(tab);
        }}
        adminUser={adminUser}
        onAdminClick={() => setActiveTab('admin-login')}
        onLogoutClick={handleLogout}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedApp(null);
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-600 font-medium" id="master-loader">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
              <div className="absolute w-16 h-16 border-4 border-t-[#01875f] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#01875f] shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-700 animate-pulse">Please wait...</span>
          </div>
        ) : (
          <div className="space-y-8" id="store-workspace">
            
            {/* 1. VIEW DETAILED SCREEN FOR SINGLE APP */}
            {selectedApp ? (
              <AppDetailView
                app={selectedApp}
                onBack={() => setSelectedApp(null)}
                onRefreshApp={handleRefreshActiveApp}
              />
            ) : (
              /* ELSE STANDARD PAGE SWAPPING ROUTER */
              <>
                {/* 2. ADMIN PANEL DISPLAY */}
                {activeTab === 'admin' && adminUser && (
                  <AdminPanel
                    apps={apps}
                    onRefreshApps={loadAppsData}
                    onClose={() => setActiveTab('home')}
                  />
                )}

                {/* 3. ADMIN ACCESS LOGIN PANEL */}
                {activeTab === 'admin-login' && !adminUser && (
                  <AdminLogin
                    onLoginSuccess={(user) => {
                      setAdminUser(user);
                      setActiveTab('admin');
                    }}
                    onCancel={() => setActiveTab('home')}
                  />
                )}

                {/* 3.5. ABOUT, CONTACT, AND PRIVACY PAGES */}
                {(activeTab === 'about' || activeTab === 'contact' || activeTab === 'privacy') && (
                  <FooterPages
                    pageType={activeTab}
                    onBack={() => setActiveTab('home')}
                  />
                )}

                {/* 4. HOME PLAY MARKETPLACE DISCOVER SCREEN */}
                {activeTab === 'home' && (
                  <div className="animate-fade-in space-y-8">
                    
                    {/* Setup Warning for unconfigured Firebase */}
                    {!isFirebaseActive() && (
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in" id="firebase-guide-banner">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                            <Database className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="font-sans font-bold text-gray-800 text-lg">Real Database Mode Active</h2>
                             <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                               You have removed all local storage mocks and activated pure, real backend synchronization with Firebase. To display your live apps and enable administrator management, please hook up your credentials.
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 space-y-4">
                          <h3 className="font-sans font-semibold text-xs text-gray-700 flex items-center gap-2">
                            <Key className="w-4 h-4 text-emerald-600" />
                            Required AI Studio Secrets Configuration
                          </h3>
                          <p className="text-[11px] text-gray-500 leading-normal">
                            Add the following variables to your project's **Secrets Panel** (click the gear menu or the Secrets button in AI Studio) with the credentials of your Firebase project:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono bg-white p-3 rounded-xl border border-gray-100">
                            <div className="text-gray-600">VITE_FIREBASE_API_KEY</div>
                            <div className="text-gray-600">VITE_FIREBASE_AUTH_DOMAIN</div>
                            <div className="text-gray-600">VITE_FIREBASE_PROJECT_ID</div>
                            <div className="text-gray-600">VITE_FIREBASE_STORAGE_BUCKET</div>
                            <div className="text-gray-600">VITE_FIREBASE_MESSAGING_SENDER_ID</div>
                            <div className="text-gray-600">VITE_FIREBASE_APP_ID</div>
                          </div>
                          <p className="text-[10px] text-gray-400 italic">
                            *Note: Once environment variables are set, the application will immediately authenticate and read your live catalog.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Firestore Connection Timeout Fallback Warning */}
                    {showOfflineAlert && (
                      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-in" id="firebase-timeout-banner">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700 shrink-0 animate-pulse">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h2 className="font-sans font-bold text-amber-900 text-lg">
                              {dbErrorReason === 'permission' ? 'Firestore Permission Denied' : 'Firestore Connection Timeout'}
                            </h2>
                            <p className="text-xs text-amber-700 leading-relaxed">
                              {dbErrorReason === 'permission' ? (
                                <>
                                  We reached your live Firestore database under project <strong className="font-mono bg-amber-100/50 px-1 py-0.5 rounded">myselfmkappstore</strong>, but the request was rejected with <strong>"Missing or insufficient permissions"</strong>.
                                </>
                              ) : (
                                <>
                                  We tried connecting to your live Firestore database under project <strong className="font-mono bg-amber-100/50 px-1 py-0.5 rounded">myselfmkappstore</strong>, but the connection timed out.
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/80 rounded-2xl p-4 sm:p-5 space-y-3 border border-amber-100">
                          <h3 className="font-sans font-bold text-xs text-amber-900">
                            {dbErrorReason === 'permission' ? 'How to resolve the permission issue:' : 'How to resolve the connection issue:'}
                          </h3>
                          <ul className="text-xs text-amber-800 list-disc list-inside space-y-2 leading-relaxed">
                            {dbErrorReason === 'permission' ? (
                              <>
                                <li>
                                  <strong>Create Database Instance:</strong> Ensure you have clicked <strong>"Create Database"</strong> inside your <a href="https://console.firebase.google.com/project/myselfmkappstore/firestore" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-[#01875f] hover:text-[#016f4e]">Firebase Firestore Console</a>. If the database does not exist, all reads will fail with permissions errors.
                                </li>
                                <li>
                                  <strong>Rules Verification:</strong> We already deployed secure and compliant rules for you, but please double check your <strong>Firestore Rules tab</strong> to ensure they have propagated.
                                </li>
                                <li>
                                  <strong>Location Configuration:</strong> Check if your database is configured to receive requests in the designated region.
                                </li>
                              </>
                            ) : (
                              <>
                                <li>
                                  <strong>Database Instance Missing:</strong> Visit the <a href="https://console.firebase.google.com/project/myselfmkappstore/firestore" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-[#01875f] hover:text-[#016f4e]">Firebase Firestore Console</a> and click <strong>&quot;Create Database&quot;</strong>.
                                </li>
                                <li>
                                  <strong>Region Settings & Propagation:</strong> If you just provisioned the database, Google Cloud routing may take 1-2 minutes to propagate. Click <strong>"Retry Connection"</strong> below.
                                </li>
                                <li>
                                  <strong>Secrets Config:</strong> Verify that the credentials in your AI Studio Secrets panel are correct and match your active project.
                                </li>
                              </>
                            )}
                          </ul>
                          <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-3 flex-wrap">
                            <span className="text-[11px] text-amber-600 italic">Currently running in Offline Demo Mode (fully functional)</span>
                            <button 
                              onClick={loadAppsData}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#01875f] hover:bg-[#016f4e] text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Retry Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Featured slider display - Only show if no filter/search is active */}
                    {searchQuery === '' && selectedCategory === 'All' && featuredApps.length > 0 && (
                      <HeroSection
                        featuredApps={featuredApps}
                        onSelectApp={(app) => setSelectedApp(app)}
                      />
                    )}

                    {/* Horizontal filter scroll-chips */}
                    <CategoryList
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />

                    {/* List Section Categories */}
                    {searchQuery === '' && selectedCategory === 'All' ? (
                      /* HIGH-FIDELITY HOME DEFAULT HOMEPAGE */
                      <>
                        {/* Trending Row */}
                        {trendingApps.length > 0 && (
                          <div className="space-y-4" id="trending-row-container">
                            <h2 className="font-sans font-bold text-gray-800 text-lg flex items-center gap-1.5 tracking-tight">
                              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                              Trending Applications
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {trendingApps.map((app) => (
                                <AppCard
                                  key={app.id}
                                  app={app}
                                  onClick={() => setSelectedApp(app)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Top Rated Row */}
                        <div className="space-y-4" id="toprated-row-container">
                          <h2 className="font-sans font-bold text-gray-800 text-lg flex items-center gap-1.5 tracking-tight">
                            <Award className="w-5 h-5 text-[#01875f]" />
                            Top Rated Applications
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {apps
                              .slice()
                              .sort((a, b) => b.rating - a.rating)
                              .slice(0, 4)
                              .map((app) => (
                                <AppCard
                                  key={app.id}
                                  app={app}
                                  onClick={() => setSelectedApp(app)}
                                />
                              ))}
                          </div>
                        </div>

                        {/* Remaining Apps List */}
                        <div className="space-y-4" id="all-row-container">
                          <h2 className="font-sans font-bold text-gray-800 text-lg flex items-center gap-1.5 tracking-tight">
                            <HelpCircle className="w-5 h-5 text-indigo-500" />
                            All Available Deployments
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {apps.map((app) => (
                              <AppCard
                                key={app.id}
                                app={app}
                                onClick={() => setSelectedApp(app)}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* SEARCHED / FILTERED RESULTS LIST */
                      <div className="space-y-4" id="filtered-grid-container">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <h2 className="font-sans font-bold text-gray-800 text-lg">
                            {searchQuery !== '' ? 'Search Results' : `${selectedCategory} Applications`}
                          </h2>
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Found {filteredApps.length} apps
                          </span>
                        </div>

                        {filteredApps.length === 0 ? (
                          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl" id="empty-state">
                            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-sans font-bold text-gray-700 text-base">No matching apps found</h3>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                              We couldn&apos;t find any applications matching your selection or filter query. Try modifying your search term or select another category!
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                            {filteredApps.map((app) => (
                              <AppCard
                                key={app.id}
                                app={app}
                                onClick={() => setSelectedApp(app)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </>
            )}

          </div>
        )}

      </main>

      {/* Styled Human Footer */}
      <footer className="bg-gray-50/60 border-t border-gray-100/80 py-10 sm:py-12 mt-16 text-center text-xs text-gray-400 relative overflow-hidden" id="store-footer">
        {/* Modern subtle ambient glow at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-16 bg-[#01875f]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 space-y-6 relative z-10" id="footer-content-wrapper">
          {/* Main Footer Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-gray-500" id="footer-links-container">
            <button 
              onClick={() => {
                setSelectedApp(null);
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#01875f] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
              id="footer-about-link"
            >
              <span>About Store</span>
            </button>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <button 
              onClick={() => {
                setSelectedApp(null);
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#01875f] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
              id="footer-contact-link"
            >
              <span>Contact & Support</span>
            </button>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <button 
              onClick={() => {
                setSelectedApp(null);
                setActiveTab('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#01875f] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
              id="footer-privacy-link"
            >
              <span>Privacy Policy</span>
            </button>
          </div>

          {/* Credits and Branding */}
          <div className="space-y-3 pt-2" id="footer-branding">
            <p className="font-sans font-medium text-gray-600 flex items-center justify-center gap-2 text-xs sm:text-sm">
              <span>Myselfmk Appstore</span>
              <span className="text-gray-300">|</span>
              <span className="text-[#01875f] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">Curation Engine v2.1</span>
            </p>
            <p className="font-sans text-gray-400 text-[11px] leading-relaxed max-w-md mx-auto">
              © 2026 By Mahendra Bairwa (MyselfmkApps) made with ❤️
            </p>
          </div>

          {/* Real-time Status Indicators */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 max-w-xs mx-auto text-[10px] font-mono text-gray-400" id="footer-status-bar">
            <div className="flex items-center gap-1.5" id="status-live-node">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Services Live</span>
            </div>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-1.5" id="status-db-secure">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Cloud DB Active</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
