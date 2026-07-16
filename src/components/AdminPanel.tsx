/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppItem, AppstoreStats } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Settings, 
  Database, 
  TrendingUp, 
  Download, 
  Star, 
  Users, 
  BookOpen, 
  X, 
  Save, 
  Upload, 
  Check, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { createNewApp, updateExistingApp, deleteAppById, isFirebaseActive, getDbModeLabel } from '../lib/firebase';
import { CATEGORIES } from '../data';

const compressAndConvertImage = (file: File, maxDimension: number = 1024, quality: number = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxDimension?: number;
}

function ImageUploader({ label, value, onChange, maxDimension = 1024 }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setLoading(true);
    try {
      const compressed = await compressAndConvertImage(file, maxDimension, 0.75);
      onChange(compressed);
    } catch (err) {
      console.error(err);
      alert('Failed to compress and upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-gray-600 flex justify-between items-center">
        <span>{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[110px] relative overflow-hidden ${
          dragActive
            ? 'border-[#01875f] bg-emerald-50/50'
            : value
            ? 'border-gray-200 bg-gray-50/20 hover:bg-gray-50/40'
            : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-1">
            <RefreshCw className="w-5 h-5 text-[#01875f] animate-spin" />
            <span className="text-[10px] text-gray-500 font-medium">Processing...</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-3 w-full">
            <div className="relative bg-white border border-gray-100 shadow-sm overflow-hidden shrink-0 w-16 h-16 rounded-xl flex items-center justify-center p-0.5">
              <img
                src={value}
                alt="Uploaded preview"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                Image Uploaded
              </span>
              <p className="text-[10px] text-gray-400 truncate max-w-full">
                {value.startsWith('data:') ? 'Base64 Encoded Image' : value}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload className="w-5 h-5 text-gray-400 mb-1" />
            <p className="text-[11px] text-gray-600 font-medium">
              Drag & drop or <span className="text-[#01875f] underline">browse</span>
            </p>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Supports PNG, JPG (Auto-compressed)
            </p>
          </div>
        )}
      </div>
      
      <input
        type="text"
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste direct image URL here..."
        className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-[10px] text-gray-500 rounded-lg p-2 outline-none transition-colors"
      />
    </div>
  );
}

interface AdminPanelProps {
  apps: AppItem[];
  onRefreshApps: () => Promise<void>;
  onClose: () => void;
}

export default function AdminPanel({ apps, onRefreshApps, onClose }: AdminPanelProps) {
  const [stats, setStats] = useState<AppstoreStats>({
    totalApps: 0,
    totalDownloads: 0,
    averageRating: 0,
    totalReviews: 0,
  });

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [editAppId, setEditAppId] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [iconUrl, setIconUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [developer, setDeveloper] = useState('');
  const [size, setSize] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [screenshot1, setScreenshot1] = useState('');
  const [screenshot2, setScreenshot2] = useState('');
  const [screenshot3, setScreenshot3] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [whatsNew, setWhatsNew] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate statistics
  useEffect(() => {
    const totalApps = apps.length;
    const totalDownloads = apps.reduce((sum, a) => sum + a.downloads, 0);
    const totalReviews = apps.reduce((sum, a) => sum + a.reviews.length, 0);
    const averageRating = totalApps > 0 
      ? parseFloat((apps.reduce((sum, a) => sum + a.rating, 0) / totalApps).toFixed(1))
      : 0.0;

    setStats({ totalApps, totalDownloads, averageRating, totalReviews });
  }, [apps]);

  // Open Form for creating new app
  const handleNewApp = () => {
    setEditAppId(null);
    setName('');
    setPackageName('');
    setCategory('Productivity');
    setIconUrl('');
    setShortDescription('');
    setDescription('');
    setVersion('');
    setDeveloper('');
    setSize('');
    setDownloadUrl('');
    setGithubUrl('');
    setScreenshot1('');
    setScreenshot2('');
    setScreenshot3('');
    setIsFeatured(false);
    setIsTrending(false);
    setWhatsNew('');
    setReleaseDate(new Date().toISOString().split('T')[0]);
    setErrorMsg('');
    setIsEditing(true);
  };

  // Open Form for editing an app
  const handleEditApp = (app: AppItem) => {
    setEditAppId(app.id);
    setName(app.name);
    setPackageName(app.packageName);
    setCategory(app.category);
    setIconUrl(app.iconUrl);
    setShortDescription(app.shortDescription);
    setDescription(app.description);
    setVersion(app.version);
    setDeveloper(app.developer);
    setSize(app.size);
    setDownloadUrl(app.downloadUrl || '#');
    setGithubUrl(app.githubUrl || '');
    setScreenshot1(app.screenshots[0] || '');
    setScreenshot2(app.screenshots[1] || '');
    setScreenshot3(app.screenshots[2] || '');
    setIsFeatured(app.isFeatured);
    setIsTrending(app.isTrending);
    setWhatsNew(app.whatsNew || '');
    setReleaseDate(app.releaseDate || new Date().toISOString().split('T')[0]);
    setErrorMsg('');
    setIsEditing(true);
  };

  // Submit add/edit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !packageName.trim() || !shortDescription.trim() || !description.trim()) {
      setErrorMsg('Please populate all required fields.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const screenshots = [screenshot1, screenshot2, screenshot3].filter(url => url.trim() !== '');

    const appData: any = {
      name,
      packageName,
      category,
      iconUrl: iconUrl || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=128&auto=format&fit=crop&q=80',
      shortDescription,
      description,
      version,
      developer,
      size,
      downloadUrl,
      screenshots,
      isFeatured,
      isTrending,
      whatsNew,
      releaseDate,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    if (githubUrl && githubUrl.trim() !== '') {
      appData.githubUrl = githubUrl.trim();
    }

    try {
      if (editAppId) {
        // Update App
        await updateExistingApp(editAppId, {
          ...appData,
          lastUpdated: new Date().toISOString().split('T')[0],
        });
      } else {
        // Create App
        await createNewApp(appData);
      }

      await onRefreshApps();
      setIsEditing(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred during database commit.');
    } finally {
      setSaving(false);
    }
  };

  // Delete App
  const handleDeleteApp = async (id: string, appName: string) => {
    const confirm = window.confirm(`Are you absolutely sure you want to delete "${appName}"?\nThis cannot be undone!`);
    if (!confirm) return;

    try {
      const deleted = await deleteAppById(id);
      if (deleted) {
        await onRefreshApps();
      } else {
        alert('Could not find the app to delete.');
      }
    } catch (err: any) {
      alert(`Error deleting app: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10" id="admin-panel-container">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#01875f]" />
            Admin Console
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Review live metrics, deploy new Android apps, or modify current listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewApp}
            className="bg-[#01875f] hover:bg-[#00704e] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            id="add-new-app-btn"
          >
            <Plus className="w-4 h-4" />
            Add New App
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
            id="exit-admin-btn"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* Persistence Config Notification */}
      <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-semibold text-gray-700">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>Database State:</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] w-fit ${
            isFirebaseActive() ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {getDbModeLabel()}
          </span>
        </div>

        {isFirebaseActive() ? (
          <p className="text-gray-400 max-w-lg">
            ✨ <span className="font-medium text-emerald-600">All set:</span> You can now deploy new listings directly to your production Firestore database.
          </p>
        ) : (
          <p className="text-gray-400 max-w-lg text-right sm:text-left">
            💡 <span className="font-medium text-gray-600">Tip:</span> Save your Firebase credentials inside your <code className="bg-gray-200 px-1 rounded">.env</code> keys to dynamically sync directly to Firestore.
          </p>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="admin-stats-grid">
        {/* Total Apps */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <BookOpen className="w-5 h-5 text-[#01875f]" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{stats.totalApps}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Total Apps</p>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Download className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}+</p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Downloads</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{stats.averageRating}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Avg Rating</p>
          </div>
        </div>

        {/* Active Reviews */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{stats.totalReviews}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* Editor Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-fade-in" id="edit-app-modal">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-sans font-bold text-gray-900 text-lg">
                {editAppId ? `Edit Listing: ${name}` : 'Deploy New Android App'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
              
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">App Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. FitSync Fitness"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Package Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Android Package ID <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="e.g. com.developer.fitsync"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Developer */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Developer / Publisher Name</label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="e.g. Myselfmk Labs"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  >
                    {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Version */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Version String</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="e.g. 1.0.0"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Size */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">App Size (MB)</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 18.4 MB"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Icon URL */}
                <ImageUploader
                  label="Icon URL"
                  value={iconUrl}
                  onChange={setIconUrl}
                />

                {/* Download URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">APK Download URL (or # for demo simulation) - Optional</label>
                  <input
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="e.g. https://myhost.com/app.apk"
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Github URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Source Repository (GitHub) - Optional</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="e.g. https://github.com/..."
                    className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                  />
                </div>

                {/* Featured / Trending switches */}
                <div className="flex items-center gap-6 py-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4.5 h-4.5 text-[#01875f] focus:ring-0 rounded-md border-gray-300"
                    />
                    Feature in carousel
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="w-4.5 h-4.5 text-[#01875f] focus:ring-0 rounded-md border-gray-300"
                    />
                    Mark as Trending
                  </label>
                </div>

              </div>

              {/* Short Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Short Pitch <span className="text-red-500">*</span> (Displayed in card and lists)</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Beautiful retro spaceship shooter gaming."
                  className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none transition-colors"
                />
              </div>

              {/* Long Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Detailed Description <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key capabilities, layout, user benefits, etc..."
                  className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none resize-none transition-colors"
                />
              </div>

              {/* What's New */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">What&apos;s New in this Release</label>
                <textarea
                  rows={3}
                  value={whatsNew}
                  onChange={(e) => setWhatsNew(e.target.value)}
                  placeholder="e.g. • Added multi-language capabilities&#10;• Fixed UI alignment bugs"
                  className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#01875f] text-gray-900 text-xs rounded-xl p-3 outline-none resize-none transition-colors"
                />
              </div>

              {/* Screenshot URLs */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-600 block">Screenshots Showcase</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ImageUploader
                    label="Screenshot 1"
                    value={screenshot1}
                    onChange={setScreenshot1}
                  />
                  <ImageUploader
                    label="Screenshot 2"
                    value={screenshot2}
                    onChange={setScreenshot2}
                  />
                  <ImageUploader
                    label="Screenshot 3"
                    value={screenshot3}
                    onChange={setScreenshot3}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setPackageName('');
                    setCategory('Productivity');
                    setIconUrl('');
                    setShortDescription('');
                    setDescription('');
                    setVersion('');
                    setDeveloper('');
                    setSize('');
                    setDownloadUrl('');
                    setGithubUrl('');
                    setScreenshot1('');
                    setScreenshot2('');
                    setScreenshot3('');
                    setIsFeatured(false);
                    setIsTrending(false);
                    setWhatsNew('');
                  }}
                  className="mr-auto text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#01875f] hover:bg-[#00704e] text-white text-xs font-semibold px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save App'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Database Apps Management Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm" id="apps-table-container">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-sans font-bold text-gray-800 text-sm">
            Live Inventory
          </h2>
          <span className="text-[10px] bg-gray-100 font-semibold text-gray-500 px-2 py-0.5 rounded-full">
            {apps.length} listings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">App Details</th>
                <th className="py-3.5 px-5">Package ID</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5 text-center">Downloads</th>
                <th className="py-3.5 px-5 text-center">Rating</th>
                <th className="py-3.5 px-5 text-center">Featured</th>
                <th className="py-3.5 px-5 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-600">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center italic text-gray-400">
                    No applications deployed. Click &apos;Add New App&apos; to create one!
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{app.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Version {app.version}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[10px] text-gray-400">
                      {app.packageName}
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-500">
                      {app.category}
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-gray-900">
                      {app.downloads.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-[11px]">
                        {app.rating}
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex rounded-full w-2 h-2 ${
                        app.isFeatured ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
                      }`} title={app.isFeatured ? 'Featured' : 'Not Featured'} />
                    </td>
                    <td className="py-4 px-5 text-right pr-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditApp(app)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                          title="Edit App Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id, app.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete App"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
