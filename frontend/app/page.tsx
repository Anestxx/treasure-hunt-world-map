'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Map from '@/components/Map';
import ChallengeModal from '@/components/ChallengeModal';
import Sidebar from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import { Location } from '@/lib/api';

function HomeContent() {
  const { user, loading } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLocationClick = (location: Location) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (location.locked) {
      alert('This location is locked. Complete other locations first!');
      return;
    }

    if (location.completed) {
      alert('You have already completed this location!');
      return;
    }

    setSelectedLocation(location);
  };

  const handleChallengeComplete = () => {
    setSelectedLocation(null);
    // Progress will be refreshed by Sidebar
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-4xl font-bold mb-2">🗺️ Treasure Hunt Map</h1>
          <p className="text-lg">Explore the world, solve challenges, and collect treasures!</p>
        </div>
        <div className="flex-1 relative">
          <Map onLocationClick={handleLocationClick} />
        </div>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={() => setShowLogin(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-4xl font-bold mb-2">🗺️ Treasure Hunt Map</h1>
        <p className="text-lg">Explore the world, solve challenges, and collect treasures!</p>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 p-4 overflow-y-auto bg-gray-50">
          <Sidebar />
        </div>
        <div className="flex-1 relative">
          <Map onLocationClick={handleLocationClick} />
        </div>
      </div>
      {selectedLocation && (
        <ChallengeModal
          locationId={selectedLocation.locationId}
          locationName={selectedLocation.name}
          onClose={() => setSelectedLocation(null)}
          onComplete={handleChallengeComplete}
        />
      )}
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}

