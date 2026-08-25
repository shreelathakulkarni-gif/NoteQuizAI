import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Volume1, 
  FastForward, 
  Headphones, 
  Sparkles, 
  ChevronRight, 
  Sliders, 
  X,
  SkipForward,
  SkipBack,
  Gauge
} from 'lucide-react';
import { NotesData } from '../types';

export interface TTSPlayerProps {
  notes: NotesData;
  documentTitle: string;
  activeTab: 'overview' | 'detailed' | 'keypoints' | 'terms';
  currentlyPlayingId: string | null;
  onPlaySection?: (sectionId: string, text: string, title: string) => void;
  onStop?: () => void;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  category: 'overview' | 'section' | 'keypoint' | 'term';
  text: string;
}

export const NotesAudioPlayer: React.FC<TTSPlayerProps> = ({
  notes,
  documentTitle,
  activeTab,
  currentlyPlayingId,
  onPlaySection,
  onStop
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [currentWord, setCurrentWord] = useState<string>('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const tracksRef = useRef<AudioTrackItem[]>([]);

  // Build audio track playlist from notes
  const buildPlaylist = (): AudioTrackItem[] => {
    const items: AudioTrackItem[] = [];

    // Track 1: Overview
    if (notes.overview) {
      items.push({
        id: 'track-overview',
        title: 'Executive Overview',
        category: 'overview',
        text: `Executive Overview for ${documentTitle}. ${notes.overview}`
      });
    }

    // Tracks: Detailed sections
    if (notes.detailedNotes && notes.detailedNotes.length > 0) {
      notes.detailedNotes.forEach((sec, idx) => {
        let secText = `Section ${idx + 1}: ${sec.heading}. `;
        if (sec.subheading) secText += `${sec.subheading}. `;
        if (sec.bulletPoints && sec.bulletPoints.length > 0) {
          secText += `Key points: ${sec.bulletPoints.join('. ')}. `;
        }
        if (sec.definitions && sec.definitions.length > 0) {
          secText += `Definitions: ${sec.definitions.map(d => `${d.term}: ${d.definition}`).join('. ')}. `;
        }
        if (sec.examples && sec.examples.length > 0) {
          secText += `Examples: ${sec.examples.join('. ')}. `;
        }

        items.push({
          id: sec.id || `track-sec-${idx}`,
          title: sec.heading,
          category: 'section',
          text: secText
        });
      });
    }

    // Track: Key takeaways
    if (notes.keyPoints && notes.keyPoints.length > 0) {
      items.push({
        id: 'track-keypoints',
        title: 'High-Yield Takeaways',
        category: 'keypoint',
        text: `High-Yield Takeaways: ${notes.keyPoints.map((kp, i) => `Point ${i + 1}: ${kp}`).join('. ')}`
      });
    }

    // Track: Key terms
    if (notes.importantTerms && notes.importantTerms.length > 0) {
      items.push({
        id: 'track-terms',
        title: 'Important Terminology',
        category: 'term',
        text: `Important Terminology: ${notes.importantTerms.map(t => `${t.term}: ${t.definition}`).join('. ')}`
      });
    }

    return items;
  };

  const playlist = buildPlaylist();
  tracksRef.current = playlist;

  // Initialize available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
        // Default to a clear English voice if available
        const defaultVoice = availableVoices.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.default)
        ) || availableVoices[0];
        
        if (defaultVoice && !selectedVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak track by index
  const playTrack = (index: number) => {
    if (!speechSupported || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();

    if (index < 0 || index >= playlist.length) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const track = playlist[index];
    setCurrentTrackIndex(index);

    const utterance = new SpeechSynthesisUtterance(track.text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : 1;

    if (selectedVoice) {
      const voiceObj = voices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Auto-advance to next track
      if (index + 1 < playlist.length) {
        playTrack(index + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        if (onStop) onStop();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const textUntil = track.text.slice(e.charIndex, e.charIndex + e.charLength || 20);
        setCurrentWord(textUntil.split(' ')[0] || '');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      playTrack(currentTrackIndex);
    }
  };

  const handleStop = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (onStop) onStop();
  };

  const handleNext = () => {
    if (currentTrackIndex + 1 < playlist.length) {
      playTrack(currentTrackIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && !isPaused) {
      // Restart current track with new rate smoothly
      playTrack(currentTrackIndex);
    }
  };

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  if (!speechSupported) {
    return (
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
        <VolumeX className="w-4 h-4 shrink-0" />
        <span>Text-to-Speech is not supported in this browser environment.</span>
      </div>
    );
  }

  return (
    <div 
      id="notes-audio-player-container"
      className="bg-white dark:bg-[#202922] p-4 sm:p-5 rounded-2xl border border-[#ecebe4] dark:border-[#2e3a31] shadow-xs transition-all space-y-3.5"
    >
      {/* Top row: Status, Current Track & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
            isPlaying && !isPaused 
              ? 'bg-[#5f7464] text-white border-[#5f7464] animate-pulse shadow-xs' 
              : 'bg-[#f3f4ee] dark:bg-[#263128] text-[#5f7464] dark:text-[#a7c2a9] border-[#ecebe4] dark:border-[#2e3a31]'
          }`}>
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5f7464] dark:text-[#a7c2a9] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Study Audio Narration
              </span>
              <span className="text-[10px] text-stone-400">
                • Track {currentTrackIndex + 1} of {playlist.length}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#3d4a3e] dark:text-white truncate">
              {currentTrack ? currentTrack.title : 'Ready to listen'}
            </h4>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Previous Track */}
          <button
            id="tts-prev-track-btn"
            onClick={handlePrev}
            disabled={currentTrackIndex === 0}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 disabled:opacity-40 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Previous chapter"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            id="tts-play-pause-btn"
            onClick={handlePlayPause}
            className="py-2 px-3.5 rounded-xl bg-[#5f7464] hover:bg-[#506354] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            title={isPlaying && !isPaused ? 'Pause narration' : 'Play study notes'}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isPaused ? 'Resume' : 'Listen Now'}</span>
              </>
            )}
          </button>

          {/* Stop */}
          {isPlaying && (
            <button
              id="tts-stop-btn"
              onClick={handleStop}
              className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
              title="Stop playback"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          {/* Next Track */}
          <button
            id="tts-next-track-btn"
            onClick={handleNext}
            disabled={currentTrackIndex >= playlist.length - 1}
            className="p-2 rounded-xl bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 disabled:opacity-40 transition-colors border border-[#ecebe4] dark:border-[#2e3a31]"
            title="Next chapter"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed / Voice Settings Toggle */}
          <button
            id="tts-settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-colors ${
              showSettings 
                ? 'bg-[#5f7464] text-white border-[#5f7464]' 
                : 'bg-[#fafaf8] dark:bg-[#263128] hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] text-stone-600 dark:text-stone-300 border-[#ecebe4] dark:border-[#2e3a31]'
            }`}
            title="Narration settings & speed"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed Quick Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ecebe4] dark:border-[#2e3a31] text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 font-semibold flex items-center gap-1 mr-1">
            <Gauge className="w-3.5 h-3.5 text-[#5f7464]" /> Speed:
          </span>
          {[0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
            <button
              key={s}
              id={`tts-speed-${s}x`}
              onClick={() => handleRateChange(s)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                rate === s
                  ? 'bg-[#5f7464] text-white'
                  : 'bg-[#fafaf8] dark:bg-[#263128] text-stone-600 dark:text-stone-400 hover:bg-[#f3f4ee] dark:hover:bg-[#303d32] border border-[#ecebe4] dark:border-[#2e3a31]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Audio Visualizer Waves when playing */}
        {isPlaying && !isPaused && (
          <div className="flex items-center gap-1 text-[11px] text-[#5f7464] dark:text-[#a7c2a9] font-medium">
            <span className="inline-block w-1 h-3 bg-[#5f7464] dark:bg-[#a7c2a9] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="inline-block w-1 h-4 bg-[#5f7464] dark:bg-[#a7c2a9] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="inline-block w-1 h-2 bg-[#5f7464] dark:bg-[#a7c2a9] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="inline-block w-1 h-5 bg-[#5f7464] dark:bg-[#a7c2a9] rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
            <span className="ml-1 text-xs">Narrating...</span>
          </div>
        )}
      </div>

      {/* Expanded Audio Settings (Voice selector, Volume, Pitch) */}
      {showSettings && (
        <div className="p-4 rounded-xl bg-[#fafaf8] dark:bg-[#263128] border border-[#ecebe4] dark:border-[#2e3a31] space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-[#3d4a3e] dark:text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#5f7464]" /> Voice & Audio Controls
            </h5>
            <button
              onClick={() => setShowSettings(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Voice Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Narrator Voice
              </label>
              <select
                id="tts-voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#5f7464]"
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Volume Toggle / Mute */}
            <div className="flex items-center justify-between sm:justify-start gap-4 pt-4 sm:pt-5">
              <button
                id="tts-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-[#202922] border border-[#ecebe4] dark:border-[#2e3a31] text-xs font-semibold text-stone-700 dark:text-stone-200"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#5f7464]" />}
                <span>{isMuted ? 'Unmute' : 'Mute Voice'}</span>
              </button>

              <button
                id="tts-read-overview-btn"
                onClick={() => playTrack(0)}
                className="text-xs font-bold text-[#5f7464] dark:text-[#a7c2a9] hover:underline"
              >
                Restart from Beginning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
