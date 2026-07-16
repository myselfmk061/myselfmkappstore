/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppItem } from '../types';
import { Download, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  featuredApps: AppItem[];
  onSelectApp: (app: AppItem) => void;
}

export default function HeroSection({ featuredApps, onSelectApp }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredApps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredApps]);

  if (!featuredApps || featuredApps.length === 0) return null;

  const app = featuredApps[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-xl h-[360px] sm:h-[400px] mb-8" id="hero-carousel">
      {/* Background Image / Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={app.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Subtle gradient to dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-neutral-900/20 z-10" />
          <img
            src={(app.screenshots && app.screenshots[0]) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'}
            alt={app.name}
            className="w-full h-full object-cover object-center scale-105 opacity-80"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6" id="hero-content">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#01875f] text-xs font-semibold px-2.5 py-1 rounded-full text-white uppercase tracking-wider">
              Featured App
            </span>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>{app.rating}</span>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-3">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-md border border-white/10 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-1 text-white line-clamp-1">
                {app.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                {app.packageName} • {app.category}
              </p>
            </div>
          </div>

          <p className="text-sm text-neutral-200 line-clamp-2 max-w-xl">
            {app.shortDescription}
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectApp(app)}
            className="bg-white hover:bg-neutral-100 text-gray-900 font-medium px-5 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            id={`hero-detail-btn-${app.id}`}
          >
            Explore App
            <ChevronRight className="w-4 h-4 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Carousel dots */}
      {featuredApps.length > 1 && (
        <div className="absolute top-6 right-6 z-20 flex gap-1.5 bg-neutral-950/40 backdrop-blur-md px-3 py-1.5 rounded-full" id="hero-dots">
          {featuredApps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-[#00E676] w-4' : 'bg-white/40 hover:bg-white/70'
              }`}
              title={`Featured App ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
