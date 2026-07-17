/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { adminLogin, loginWithGithub, isFirebaseActive } from '../lib/firebase';
import { ShieldCheck, AlertCircle, Key, Mail, Lock, ArrowLeft, Github } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await adminLogin(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isLive = isFirebaseActive();

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 sm:p-10" id="admin-login-card">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 font-semibold select-none cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Cancel Access
      </button>

      {/* Styled custom play store triangle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-md">
            <defs>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#00B0FF" />
              </linearGradient>
            </defs>
            <polygon points="10,5 90,50 10,95" fill="url(#g2)" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Admin Console Access
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          Secure identity verification required to manage app store catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-[11px] font-semibold flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@myselfmk.com"
              className="block w-full pl-10 pr-3.5 py-2.5 border border-gray-200 focus:border-[#01875f] text-gray-900 text-xs rounded-xl outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              className="block w-full pl-10 pr-3.5 py-2.5 border border-gray-200 focus:border-[#01875f] text-gray-900 text-xs rounded-xl outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#01875f] hover:bg-[#00704e] text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer mt-6"
        >
          <ShieldCheck className="w-4 h-4" />
          {loading ? 'Authenticating...' : 'Sign In as Admin'}
        </button>
      </form>

      {/* Demo helper */}
      <div className="mt-8 border-t border-gray-100 pt-6 text-center">
        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
          <p className="text-[11px] font-bold text-indigo-800 flex items-center justify-center gap-1 mb-1">
            <Key className="w-3.5 h-3.5" />
            {isLive ? 'Live Mode Active' : 'Demo Credentials'}
          </p>
          <p className="text-[10px] text-indigo-600/90 leading-normal">
            {isLive ? (
              'This application is configured with Firebase Firestore. Use your official Firebase Admin account to log in.'
            ) : (
              <>
                Use the following credentials to access the Admin Console and edit apps:
                <br />
                <span className="font-semibold block mt-1 select-all bg-white px-2 py-0.5 rounded border border-indigo-100 w-fit mx-auto font-mono text-[9px]">
                  Email: admin@myselfmk.com
                </span>
                <span className="font-semibold block mt-1 select-all bg-white px-2 py-0.5 rounded border border-indigo-100 w-fit mx-auto font-mono text-[9px]">
                  Password: password123
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
