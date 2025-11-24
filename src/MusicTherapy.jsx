import React, { useState } from 'react';

export default function MusicTherapy() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const getSongRecommendation = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/get-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: userInput })
      });

      if (!response.ok) throw new Error('Failed to fetch AI recommendation');

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
      setRecommendation(null);
    }

    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="main-box">
          <div className="inner-box">

            {/* Header */}
            <div className="header">
              <h1>music_is_my_therapist</h1>
              <p>Type how you're feeling and get an AI-powered song recommendation.</p>
              <p className="note">[no data collected]</p>
            </div>

            {/* Input */}
            <div className="input-box">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="how are you feeling today?"
                disabled={isLoading}
              />
              <button
                onClick={getSongRecommendation}
                disabled={!userInput.trim() || isLoading}
                className="submit-btn"
              >
                {isLoading ? '[searching...]' : '[find_song]'}
              </button>
            </div>

            {/* Output */}
            {recommendation && (
              <div className="output-box">
                <div className="output-text">
                  <div><strong>song:</strong> {recommendation.song}</div>
                  <div><strong>artist:</strong> {recommendation.artist}</div>
                  <p>{recommendation.reason}</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="error-box">{error}</div>}

          </div>
        </div>
      </div>
    </div>
  );
}
