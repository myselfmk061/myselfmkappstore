/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CATEGORIES } from '../data';

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="mb-8" id="categories-container">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-sans font-bold text-gray-800 text-lg tracking-tight">
          Browse Categories
        </h2>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border whitespace-nowrap cursor-pointer select-none transition-all ${
                isActive
                  ? 'bg-[#01875f] text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
              id={`cat-chip-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
