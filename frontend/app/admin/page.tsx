'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.username !== 'admin')) {
      router.push('/');
      return;
    }

    if (user && user.username === 'admin') {
      loadData();
    }
  }, [user, authLoading, router]);

  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const loadData = async () => {
    try {
      // Load locations and challenges
      // Note: You may need to create these endpoints or fetch from existing ones
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      locationId: formData.get('locationId'),
      name: formData.get('name'),
      country: formData.get('country'),
      coordinates: {
        lat: parseFloat(formData.get('lat') as string),
        lng: parseFloat(formData.get('lng') as string),
      },
      challengeId: formData.get('challengeId'),
      points: parseInt(formData.get('points') as string) || 50,
      badge: formData.get('badge'),
      locked: formData.get('locked') === 'on',
      unlockRequirement: parseInt(formData.get('unlockRequirement') as string) || 0,
    };

    try {
      await axios.post(`${API_URL}/admin/locations`, data, getAuthHeaders());
      alert('Location created successfully!');
      setShowLocationForm(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create location');
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      challengeId: formData.get('challengeId'),
      type: formData.get('type'),
      question: formData.get('question'),
      options: (formData.get('options') as string)?.split(',').map(o => o.trim()).filter(o => o) || [],
      answer: formData.get('answer'),
      hint: formData.get('hint') || '',
      points: parseInt(formData.get('points') as string) || 50,
      difficulty: formData.get('difficulty') || 'medium',
    };

    try {
      await axios.post(`${API_URL}/admin/challenges`, data, getAuthHeaders());
      alert('Challenge created successfully!');
      setShowChallengeForm(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create challenge');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || user.username !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Map
          </Link>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={() => {
              setShowLocationForm(!showLocationForm);
              setShowChallengeForm(false);
            }}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 font-semibold"
          >
            {showLocationForm ? 'Cancel' : 'Create New Location'}
          </button>
          <button
            onClick={() => {
              setShowChallengeForm(!showChallengeForm);
              setShowLocationForm(false);
            }}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 font-semibold"
          >
            {showChallengeForm ? 'Cancel' : 'Create New Challenge'}
          </button>
        </div>

        {showLocationForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Location</h2>
            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location ID</label>
                  <input
                    type="text"
                    name="locationId"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., France"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 48.8566"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 2.3522"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Challenge ID (MongoDB ObjectId)</label>
                  <input
                    type="text"
                    name="challengeId"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Challenge ObjectId"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <input
                    type="number"
                    name="points"
                    defaultValue={50}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge Name</label>
                  <input
                    type="text"
                    name="badge"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., paris_explorer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unlock Requirement</label>
                  <input
                    type="number"
                    name="unlockRequirement"
                    defaultValue={0}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="locked"
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Locked</label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Create Location
              </button>
            </form>
          </div>
        )}

        {showChallengeForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Challenge</h2>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Challenge ID</label>
                  <input
                    type="text"
                    name="challengeId"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g., paris_quiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select name="type" required className="w-full p-2 border rounded">
                    <option value="quiz">Quiz</option>
                    <option value="riddle">Riddle</option>
                    <option value="logic">Logic</option>
                    <option value="word">Word</option>
                    <option value="number">Number</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <textarea
                    name="question"
                    required
                    rows={3}
                    className="w-full p-2 border rounded"
                    placeholder="Enter the question..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Options (comma-separated, leave empty for non-quiz)</label>
                  <input
                    type="text"
                    name="options"
                    className="w-full p-2 border rounded"
                    placeholder="Option 1, Option 2, Option 3, Option 4"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Answer</label>
                  <input
                    type="text"
                    name="answer"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="Correct answer"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Hint (optional)</label>
                  <input
                    type="text"
                    name="hint"
                    className="w-full p-2 border rounded"
                    placeholder="Hint for the challenge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <input
                    type="number"
                    name="points"
                    defaultValue={50}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select name="difficulty" className="w-full p-2 border rounded">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Create Challenge
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          <div className="space-y-2 text-gray-700">
            <p>1. First create a Challenge using the "Create New Challenge" button</p>
            <p>2. Copy the Challenge ID (MongoDB ObjectId) from the response</p>
            <p>3. Use that Challenge ID when creating a Location</p>
            <p>4. Alternatively, you can use the seed script: <code className="bg-gray-100 px-2 py-1 rounded">node backend/scripts/seed.js</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

