/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppItem } from '../types';
import { Star, ArrowDownToLine } from 'lucide-react';

interface AppCardProps {
  key?: string;
  app: AppItem;
  onClick: () => void;
}

export default function AppCard({ app, onClick }: AppCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white rounded-2xl p-3 border border-gray-100 hover:border-gray-200/80 hover:shadow-md transition-all duration-300 cursor-pointer select-none relative overflow-hidden"
      id={`app-card-${app.id}`}
    >
      {/* App Icon container with Zoom hover effect */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden mb-3 border border-gray-100/50 flex items-center justify-center">
        <img
          src={app.iconUrl}
          alt={app.name}
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-sm"
          referrerPolicy="no-referrer"
        />
        {/* Play store style hover download accent */}
        <div className="absolute inset-0 bg-[#01875f]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-h-[70px]">
        <h3 className="font-sans font-semibold text-gray-800 text-sm leading-tight line-clamp-1 group-hover:text-[#01875f] transition-colors">
          {app.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">
          {app.developer}
        </p>
        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md w-fit mt-1.5 uppercase tracking-wider scale-95 origin-left">
          {app.category}
        </span>
      </div>

      {/* Rating & Size Row */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 mt-2 text-[11px]">
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          <span className="font-bold text-gray-800">{app.rating}</span>
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        </div>
        <div className="flex items-center gap-1 text-gray-400 font-mono font-medium">
          <ArrowDownToLine className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span>{app.size}</span>
        </div>
      </div>
    </div>
  );
}
