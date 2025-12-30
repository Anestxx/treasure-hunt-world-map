'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { progressAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Progress {
  points: number;
  badges: string[];
  locationsCompleted: any[];
  totalLocations: number;
  completionPercentage: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadProgress();
    }
  }, [user, authLoading, router]);

  const loadProgress = async () => {
    try {
      const data = await progressAPI.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Map
          </Link>
          <h1 className="text-4xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Username:</span> {user.username}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
        </div>

        {progress && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-3xl font-bold text-blue-600">{progress.points}</div>
                  <div className="text-gray-600">Total Points</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <div className="text-3xl font-bold text-yellow-600">{progress.badges.length}</div>
                  <div className="text-gray-600">Badges Earned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-3xl font-bold text-green-600">
                    {progress.locationsCompleted.length} / {progress.totalLocations}
                  </div>
                  <div className="text-gray-600">Locations Completed</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">{progress.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${progress.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Badges</h2>
              <div className="flex flex-wrap gap-3">
                {progress.badges.length > 0 ? (
                  progress.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium"
                    >
                      🏆 {badge}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No badges earned yet. Start exploring!</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Completed Locations</h2>
              <div className="space-y-2">
                {progress.locationsCompleted.length > 0 ? (
                  progress.locationsCompleted.map((location: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200"
                    >
                      <div>
                        <span className="font-semibold">{location.name}</span>
                        <span className="text-gray-600 ml-2">({location.country})</span>
                      </div>
                      <span className="text-green-600">✓</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No locations completed yet. Start exploring!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

