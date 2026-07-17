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
  Sparkles,
  User,
  Plus,
  Minus,
  Briefcase,
  GraduationCap,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  BookOpen
} from 'lucide-react';

interface FooterPagesProps {
  pageType: 'about' | 'contact' | 'privacy' | 'faqs' | 'admin-profile' | 'terms';
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I download and install an APK from Myselfmk Appstore?",
      answer: "Click on any app card in the marketplace to open the detailed app page. If the app has an active binary or APK upload, click on the prominent green 'Download APK' button. Once downloaded, open the APK file on your Android device. Note that you may need to enable 'Install from Unknown Sources' in your Android system security settings to proceed with the installation."
    },
    {
      question: "Are the applications listed on this platform safe?",
      answer: "Yes, absolutely. Every app release, update, and APK upload is individually reviewed, compiled, and hand-curated by our admin team before publication. However, as independent developer releases, they are not signed by traditional Google Play Store enterprise certificates. We always list the explicit system permissions requested by each app on its detail page so you can install with absolute confidence."
    },
    {
      question: "Can I request or submit my own application?",
      answer: "We are always looking for stellar indie applications, experimental games, or utility projects! Registered system creators and admins can upload and manage apps directly from the custom admin panel. If you are an external developer, use our Contact Form or email us directly at myselfmkapps@gmail.com with your project details, and our curation team will review it."
    },
    {
      question: "Is there an Admin panel to manage these applications?",
      answer: "Yes. Authorized curators can log in using their credentials (via Firebase Authentication) to access a fully customized Admin Dashboard. There, administrators can add new listings, upload release files, edit existing categories, and respond to community review logs in real-time."
    },
    {
      question: "How can I write a review or provide feedback?",
      answer: "We value community collaboration! Open any application detail page to read reviews and submit your own rating and written comments. Your review is stored securely in our Firestore database and displayed immediately to help other store visitors evaluate the application."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/myselfmkapps@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || "New Contact Message",
          message: message,
          _subject: `Myselfmk Appstore Contact: ${subject || "General Inquiry"}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const errData = await response.json();
        setSubmitError(errData?.message || "Failed to send message. Please try again or email directly.");
      }
    } catch (error) {
      console.error("FormSubmit API submission error:", error);
      setSubmitError("A connection error occurred. Please verify your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <a href="mailto:myselfmkapps@gmail.com" className="text-sm font-bold text-gray-800 hover:text-[#01875f] transition-colors break-all">
                    myselfmkapps@gmail.com
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

                  {submitError && (
                    <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-100/60 animate-fade-in" id="contact-error-banner">
                      {submitError}
                    </div>
                  )}

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
                If you require clarification on how data is cached or wish to query administrative credentials, you can reach the curation team immediately at <a href="mailto:myselfmkapps@gmail.com" className="font-semibold text-[#01875f] hover:underline">myselfmkapps@gmail.com</a>.
              </p>
            </section>

          </div>
        </div>
      )}

      {/* RENDER FAQS PAGE */}
      {pageType === 'faqs' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8" id="faqs-page">
          <div className="space-y-3 border-b border-gray-50 pb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#01875f] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-800 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs text-gray-400">
              Find quick answers about downloading APKs, safety guidelines, and developer submittals.
            </p>
          </div>

          <div className="space-y-4" id="faq-accordion-container">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-[#01875f] bg-emerald-50/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-sans font-bold text-gray-800 text-xs sm:text-sm cursor-pointer select-none focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 shrink-0 text-gray-400">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#01875f]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER ADMIN PROFILE PAGE */}
      {pageType === 'admin-profile' && (
        <div className="space-y-8" id="admin-profile-page">
          {/* Main profile card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-500 via-[#01875f] to-teal-600"></div>
            
            <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-[#01875f] text-white flex items-center justify-center font-sans font-extrabold text-3xl shadow-md shrink-0">
                MB
              </div>
              <div className="text-center sm:text-left space-y-2 pb-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-sans font-extrabold text-2xl text-gray-800 tracking-tight">Mahendra Bairwa</h1>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[#01875f] text-[10px] font-mono rounded-full font-bold uppercase tracking-wider">Lead Creator</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Founder & Developer of MyselfmkApps</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> India / Global</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-gray-400" /> myselfmkapps.com</span>
                </div>
              </div>
            </div>

            {/* Content splits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-50">
              {/* Bio & Philosophy */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-[#01875f]" />
                    Developer Biography
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Hello! I'm Mahendra Bairwa, an independent full-stack developer and software curator specializing in high-performance Android distributions, lightweight web architectures, and seamless cloud deployments.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Under the brand <strong>MyselfmkApps</strong>, my mission is to deliver secure, accessible, and fast utility APKs to end-users without the boilerplate overhead of traditional platforms. I designed this curation platform as a dynamic repository to track user analytics, host pristine assets, and provide lightning-fast deliveries.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Development Philosophy
                  </h3>
                  <blockquote className="border-l-2 border-[#01875f] pl-4 py-1 text-xs text-gray-500 italic leading-relaxed">
                    "Software should be beautifully simple, highly secure, and instantly accessible. Curation is an art of selecting only what delivers immediate value to the user."
                  </blockquote>
                </div>
              </div>

              {/* Skills & Quick Stats */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                  <h4 className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wider">Technical Specialties</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span className="font-semibold">Android Dev (Kotlin)</span>
                      <span className="text-gray-400 font-mono">Expert</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span className="font-semibold">Full Stack (Vite/React)</span>
                      <span className="text-gray-400 font-mono">Advanced</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span className="font-semibold">Firebase (DB/Auth/Rules)</span>
                      <span className="text-gray-400 font-mono">Pro</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Direct buttons */}
                <div className="flex flex-col gap-2">
                  <a 
                    href="mailto:myselfmkapps@gmail.com"
                    className="w-full flex items-center justify-center gap-2 bg-[#01875f] hover:bg-[#016f4e] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors text-center cursor-pointer select-none"
                  >
                    <Mail className="w-4 h-4" />
                    Email Developer
                  </a>
                  <a 
                    href="https://github.com/myselfmk061" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors text-center cursor-pointer select-none"
                  >
                    <Github className="w-4 h-4" />
                    Follow on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TERMS OF SERVICE PAGE */}
      {pageType === 'terms' && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8" id="terms-page">
          <div className="space-y-3 border-b border-gray-50 pb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-800 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-gray-400">
              Last Updated: July 16, 2026 • Myselfmk Appstore Terms
            </p>
          </div>

          <div className="space-y-6 text-xs text-gray-600 leading-relaxed">
            <p>
              Welcome to Myselfmk Appstore. By accessing or downloading materials from this platform, you agree to comply with and be bound by the following Terms and Conditions of use.
            </p>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" />
                1. Acceptable Use License
              </h3>
              <p>
                All applications, screenshots, and APK binaries hosted on this repository are provided solely for personal, non-commercial playtesting and usage. You may not decompile, reverse-engineer, or redistribute any release package without explicit consent from Mahendra Bairwa (MyselfmkApps).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                2. User Reviews & Community Ethics
              </h3>
              <p>
                Any user-contributed reviews, ratings, or comment logs published in our interactive channels must remain respectful and genuine. Spamming, advertising, posting malicious content, or artificial rating manipulation is strictly prohibited and will result in permanent Firebase account revocation.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                3. Disclaimer of Warranties
              </h3>
              <p>
                All software and resources are distributed on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. You accept complete responsibility for your mobile device security and backup procedures when installing downloaded APK releases from our channels.
              </p>
            </section>

            <section className="space-y-2 border-t border-gray-50 pt-5">
              <h3 className="font-sans font-bold text-gray-800 text-sm">
                4. Questions & Clarification
              </h3>
              <p>
                If you require official permissions or have inquiries regarding our brand guidelines, please submit a message using our interactive contact system or contact us at <a href="mailto:myselfmkapps@gmail.com" className="font-semibold text-[#01875f] hover:underline">myselfmkapps@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      )}
    </motion.div>
  );
}
