import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  Mail, 
  MapPin, 
  Github, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Globe, 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Lock, 
  Eye, 
  FileText, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface FooterPagesProps {
  pageType: 'about' | 'contact' | 'privacy';
  onBack: () => void;
}

export default function FooterPages({ pageType, onBack }: FooterPagesProps) {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    // Simulate API delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto space-y-8"
      id="footer-pages-container"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4" id="page-nav-header">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#01875f] transition-colors group cursor-pointer bg-transparent border-none py-1 px-3 rounded-full hover:bg-gray-100"
          id="page-back-btn"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Store
        </button>
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
          Store Information • {pageType}
        </span>
      </div>

      {/* RENDER ABOUT PAGE */}
      {pageType === 'about' && (
        <div className="space-y-8" id="about-page">
          {/* Hero Banner Card */}
          <div className="bg-gradient-to-tr from-emerald-50 via-teal-50/30 to-white border border-emerald-100/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#01875f]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative space-y-4 max-w-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#01875f]/10 text-[#01875f] flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-800 tracking-tight">
                About Myselfmk <span className="text-[#01875f]">Appstore</span>
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Welcome to Myselfmk Appstore, a hand-curated, high-performance catalog of applications designed for smooth delivery, APK access, and modular developer playtesting. Styled with native Google Play architecture, we offer developer-friendly deployment monitoring and real-time review ecosystems.
              </p>
            </div>
          </div>

          {/* Grid Cards of Core Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="about-core-pillars">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-gray-800">Curation First</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No cluttered databases or automated scripts. Every build is individually compiled, assessed, and listed for target hardware profiles.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-gray-800">Durable Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Integrated directly with cloud-hosted Firebase environments to securely manage app catalogs, admin privileges, and user feedback pipelines.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-gray-800">Direct Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Eliminate complex package distribution loops. Download compiled binaries, web previews, and release APK versions instantly.
              </p>
            </div>
          </div>

          {/* Platform Architecture Section */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="font-sans font-bold text-gray-800 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#01875f]" />
              Platform Architecture & Curation
            </h2>
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                Myselfmk Appstore represents the convergence of high-fidelity client experience and fully dynamic backends. Rather than relying on simple file systems or static listings, our server is backed by robust, low-latency Firebase cloud infrastructure.
              </p>
              <p>
                This allows for instantaneous updates: whenever an administrator uploads a new application, publishes an APK update, or corrects app details in the Admin Panel, the live marketplace synchronizes without requiring page refreshes. Users also benefit from functional review channels, enabling genuine peer-to-peer feedback.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER CONTACT PAGE */}
      {pageType === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8" id="contact-page">
          
          {/* Left Column: Info Cards */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-800 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                Have questions regarding custom app publication, API integration, or technical support? Drop a message and we will respond as soon as possible.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-semibold text-xs text-gray-400 uppercase tracking-wider">Email Channels</h4>
                  <a href="mailto:myselfmk061@gmail.com" className="text-sm font-bold text-gray-800 hover:text-[#01875f] transition-colors break-all">
                    myselfmk061@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-semibold text-xs text-gray-400 uppercase tracking-wider">GitHub Project</h4>
                  <a 
                    href="https://github.com/myselfmk061/myselfmkappstore" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors break-all flex items-center gap-1"
                  >
                    myselfmkappstore
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-semibold text-xs text-gray-400 uppercase tracking-wider">Developer Base</h4>
                  <p className="text-sm font-bold text-gray-800">
                    Southeast Asia • Cloud Native Deployments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  id="contact-form-element"
                >
                  <h2 className="font-sans font-bold text-gray-800 text-base mb-4">Direct Message Form</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs p-3 bg-gray-50 focus:bg-white text-gray-900 border border-gray-100 focus:border-[#01875f] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01875f] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full text-xs p-3 bg-gray-50 focus:bg-white text-gray-900 border border-gray-100 focus:border-[#01875f] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01875f] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Android app submittal, custom APK query"
                      className="w-full text-xs p-3 bg-gray-50 focus:bg-white text-gray-900 border border-gray-100 focus:border-[#01875f] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01875f] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message details here..."
                      className="w-full text-xs p-3 bg-gray-50 focus:bg-white text-gray-900 border border-gray-100 focus:border-[#01875f] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01875f] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !email || !message}
                    className="w-full flex items-center justify-center gap-2 bg-[#01875f] hover:bg-[#016f4e] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer select-none shadow-sm"
                    id="submit-message-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Delivering Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                  id="contact-success-panel"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#01875f]">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-sans font-bold text-gray-800 text-base">Message Sent Successfully!</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Myselfmk Appstore. Your communication has been dispatched. We will review your inquiry and reply shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#01875f] bg-emerald-50 hover:bg-[#01875f]/10 py-2 px-5 rounded-full transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* RENDER PRIVACY POLICY PAGE */}
      {pageType === 'privacy' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8" id="privacy-page">
          <div className="space-y-3 border-b border-gray-50 pb-5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#01875f] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-800 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400">
              Last Updated: July 16, 2026 • Myselfmk Appstore Team
            </p>
          </div>

          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            
            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                1. Data We Collect
              </h3>
              <p>
                Myselfmk Appstore operates primarily as an open-access showcase directory for software releases. We do not gather or track personal identity data of general end-users browsing or downloading apps.
              </p>
              <p>
                If you are registered as a system Creator or Administrator, we securely process and store registration identifiers (such as user emails and passwords) strictly through <strong>Firebase Authentication</strong> to ensure secure panel access.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#01875f]" />
                2. Public Interactive Content
              </h3>
              <p>
                When submitting reviews, ratings, or developer feedback for any specific app within the store, the chosen username, score, and text description are posted transparently inside the Firestore database. These remain visible to all public marketplace visitors. Do not include sensitive information in reviews.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Application Releases & Safety
              </h3>
              <p>
                All binary distributions and direct APK release packages listed in the Myselfmk Appstore are fully vetted by administrators. However, stand-alone releases request individual hardware permissions upon installation. We strongly encourage users to review specific Android package scopes before finishing installation.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                4. Cookies and Local Storage
              </h3>
              <p>
                Our store does not employ invasive tracking cookies, third-party advertising pixels, or analytics beacons. We only use essential local browser storage (`localStorage`) to retain transient local preferences such as search history filters, active interface tabs, and secure login session tokens.
              </p>
            </section>

            <section className="space-y-2 border-t border-gray-50 pt-5">
              <h3 className="font-sans font-bold text-gray-800 text-sm">
                5. Inquiries and Contact
              </h3>
              <p>
                If you require clarification on how data is cached or wish to query administrative credentials, you can reach the curation team immediately at <a href="mailto:myselfmk061@gmail.com" className="font-semibold text-[#01875f] hover:underline">myselfmk061@gmail.com</a>.
              </p>
            </section>

          </div>
        </div>
      )}
    </motion.div>
  );
}
