'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressAPI } from '@/lib/api';
import Link from 'next/link';

interface Progress {
  points: number;
  badges: string[];
  locationsCompleted: any[];
  totalLocations: number;
  completionPercentage: number;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const data = await progressAPI.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Welcome, {user.username}!</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Logout
        </button>
      </div>

      {progress && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Points</span>
              <span className="text-sm font-bold text-blue-600">{progress.points}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress.completionPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress.locationsCompleted.length} / {progress.totalLocations} locations
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Badges</span>
              <span className="text-sm font-bold text-yellow-600">{progress.badges.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.badges.slice(0, 5).map((badge, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
              {progress.badges.length > 5 && (
                <span className="text-xs text-gray-500">+{progress.badges.length - 5} more</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/profile"
              className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Full Profile →
            </Link>
            <Link
              href="/leaderboard"
              className="block text-center text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
            >
              Leaderboard →
            </Link>
            {user?.username === 'admin' && (
              <Link
                href="/admin"
                className="block text-center text-red-600 hover:text-red-800 text-sm font-medium mt-2"
              >
                Admin Panel →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

