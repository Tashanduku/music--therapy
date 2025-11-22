import React, { useState } from 'react';
import { Music } from 'lucide-react';

export default function MusicTherapy() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [lampOn, setLampOn] = useState(false);
  const [plantGrow, setPlantGrow] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [crystalGlow, setCrystalGlow] = useState(false);

  const getSongRecommendation = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Based on this person's feelings or situation: "${userInput}"
              
Please recommend ONE specific song that would resonate with what they're going through. Return ONLY a JSON object with this exact format:
{
  "song": "Song Title",
  "artist": "Artist Name",
  "reason": "A brief, empathetic explanation of why this song fits (2-3 sentences)"
}

Do not include any markdown, backticks, or extra text. Just the JSON object.`
            }
          ],
        })
      });

      const data = await response.json();
      const text = data.content.find(c => c.type === 'text')?.text || '';
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const songData = JSON.parse(cleanText);
      setRecommendation(songData);
    } catch (error) {
      console.error('Error:', error);
      setRecommendation({
        song: "The Middle",
        artist: "Jimmy Eat World",
        reason: "Sometimes we all need a reminder that everything will be alright. This song offers comfort and perspective during difficult times."
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="app-container">

      <div className="scanlines" />

      <div className="content-wrapper">
        <div className="main-box">
          <div className="inner-box">
            
            {/* Header */}
            <div className="header">
              <div className="status">
                <div className="status-dot"></div>
                <h1>music_is_my_therapist</h1>
              </div>

              <p>&gt; you're in the chair. type out whatever is on your mind.</p>
              <p>&gt; we'll find a song based on whatever you're going through.</p>
              <p className="note">[no data collected] [click around]</p>
            </div>

            {/* Interactive Icons */}
            <div className="icon-grid">
              <button
                onClick={() => setLampOn(!lampOn)}
                className={`icon-btn ${lampOn ? 'lamp-on' : 'lamp-off'}`}
                title="lamp"
              >
                💡
              </button>

              <button
                onClick={() => setPlantGrow((plantGrow + 1) % 4)}
                className="icon-btn"
              >
                {['🌱','🪴','🌿','🌳'][plantGrow]}
              </button>

              <button
                onClick={() => setBookOpen(!bookOpen)}
                className={`icon-btn ${bookOpen ? 'book-on' : 'book-off'}`}
              >
                {bookOpen ? '📖' : '📕'}
              </button>

              <button
                onClick={() => setCrystalGlow(!crystalGlow)}
                className={`icon-btn ${crystalGlow ? 'crystal-on' : 'crystal-off'}`}
              >
                🔮
              </button>

              <button className="icon-btn">🐕</button>
            </div>

            {/* Input */}
            <div className="input-box">
              <div className="input-label">
                <span className="grey">[input]</span> $
              </div>

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
                <div className="output-label">
                  <div className="dot" />
                  <span>[output]</span>
                </div>

                <div className="output-text">
                  <div><span className="grey">song:</span> {recommendation.song}</div>
                  <div><span className="grey">artist:</span> {recommendation.artist}</div>

                  <p className="reason">{recommendation.reason}</p>
                </div>
              </div>
            )}

            <div className="ascii">
{`    ♪
   ♪ ♪
  ♪   ♪`}
            </div>

          </div>
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <span>[status: online]</span>
          <span>[system: ready]</span>
        </div>
      </div>
    </div>
  );
}
