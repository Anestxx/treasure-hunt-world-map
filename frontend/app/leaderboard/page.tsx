'use client';

import { useEffect, useState } from 'react';
import { leaderboardAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  badgesCount: number;
  locationsCount: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; totalUsers: number; points: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    if (user) {
      loadMyRank();
    }
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardAPI.getGlobal(20);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRank = async () => {
    if (!user) return;
    try {
      const data = await leaderboardAPI.getMyRank(user.id);
      setMyRank(data);
    } catch (error) {
      console.error('Failed to load my rank:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Map
          </Link>
          <h1 className="text-4xl font-bold">🏆 Leaderboard</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {myRank && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Rank</h2>
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-4xl font-bold">#{myRank.rank}</div>
                <div className="text-sm opacity-90">out of {myRank.totalUsers} players</div>
              </div>
              <div className="border-l border-yellow-300 pl-6">
                <div className="text-2xl font-bold">{myRank.points}</div>
                <div className="text-sm opacity-90">points</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Global Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={user && entry.username === user.username ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                        {entry.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                        {entry.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                        <span className="text-lg font-semibold">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.username}
                        {user && entry.username === user.username && (
                          <span className="ml-2 text-blue-600">(You)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">{entry.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.badgesCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.locationsCount}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

