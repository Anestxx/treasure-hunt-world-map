'use client';

import { useState, useEffect } from 'react';
import { challengesAPI, Challenge } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ChallengeModalProps {
  locationId: string;
  locationName: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function ChallengeModal({
  locationId,
  locationName,
  onClose,
  onComplete,
}: ChallengeModalProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; message: string; pointsEarned?: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    loadChallenge();
  }, [locationId]);

  const loadChallenge = async () => {
    try {
      const data = await challengesAPI.getByLocation(locationId);
      setChallenge(data);
    } catch (error) {
      console.error('Failed to load challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;

    setSubmitting(true);
    try {
      const userAnswer = challenge.type === 'quiz' ? selectedOption : answer;
      const response = await challengesAPI.submitAnswer(locationId, userAnswer);
      setResult(response);
      
      if (response.correct) {
        await refreshUser();
        setTimeout(() => {
          onComplete();
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      setResult({
        correct: false,
        message: error.response?.data?.message || 'Failed to submit answer',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">Loading challenge...</div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center text-red-600">Failed to load challenge</div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{locationName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {challenge.type.toUpperCase()}
          </span>
          <span className="ml-2 inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {challenge.difficulty}
          </span>
          <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            {challenge.points} points
          </span>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">{challenge.question}</p>

          {challenge.type === 'quiz' && challenge.options.length > 0 ? (
            <div className="space-y-2">
              {challenge.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-3 border-2 rounded cursor-pointer transition ${
                    selectedOption === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-3 border-2 border-gray-200 rounded focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>

        {challenge.hint && (
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">{challenge.hint}</p>
              </div>
            )}
          </div>
        )}

        {result && (
          <div
            className={`mb-4 p-4 rounded ${
              result.correct
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="font-semibold">{result.message}</p>
            {result.pointsEarned && (
              <p className="text-sm mt-1">+{result.pointsEarned} points!</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={submitting || (challenge.type === 'quiz' ? !selectedOption : !answer)}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
}

