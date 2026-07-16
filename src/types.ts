/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: string;
  iconUrl: string;
  shortDescription: string;
  description: string;
  version: string;
  developer: string;
  size: string; // e.g., "14.5 MB"
  downloads: number; // e.g., 1420
  downloadUrl: string; // APK download link
  githubUrl?: string; // Optional source code repository
  screenshots: string[]; // List of image URLs
  rating: number; // e.g., 4.8
  releaseDate: string; // e.g., "2026-05-10"
  lastUpdated: string; // e.g., "2026-07-12"
  isFeatured: boolean;
  isTrending: boolean;
  whatsNew: string; // Changelog or what's new in this version
  reviews: Review[];
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AppstoreStats {
  totalApps: number;
  totalDownloads: number;
  averageRating: number;
  totalReviews: number;
}
