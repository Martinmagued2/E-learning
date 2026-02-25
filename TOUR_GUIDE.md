# E-Learning Safety App - Interactive Guided Tour

## New Feature: Auto-Generated Guided Tour with Text-to-Speech

### Text-to-Speech (TTS) System

**File:** `src/js/tts.js`

- Uses Web Speech API (built into browsers)
- Automatically selects best available Arabic voice (Egyptian → Saudi → Any Arabic)
- Generates speech on-the-fly - no audio files needed!
- Controls: speak, stop, pause, resume
- Configurable rate, pitch, and volume

### Interactive Guided Tour

**File:** `src/js/tour.js`

- Comprehensive step-by-step tour for all screens
- Visual effects:
  - Dark overlay (spotlight effect)
  - Element highlighting with pulsing animation
  - Tooltips with gradient backgrounds
  - Smooth scrolling to tour elements
- Navigation controls:
  - "Next" button to advance
  - "Skip Tour" button to end
- Auto-start on first visit (tracked in localStorage)

### Tours Available

1. **Welcome Screen** (3 steps)
   - Welcome message
   - Name input explanation
   - Start button guide

2. **Dashboard** (6 steps)
   - User info section
   - Progress circle explanation
   - Courses grid overview
   - First course (unlocked) guidance
   - Locked courses explanation
   - Audio controller tour

3. **Course Screen** (6 steps)
   - Course title
   - Progress bar
   - Lesson content area
   - Previous/Next buttons
   - Lesson indicator

4. **Quiz Screen** (4 steps)
   - Quiz title
   - Question progress
   - Question reading tips
   - Answer selection

5. **Certificate Screen** (4 steps)
   - Certificate overview
   - Student name highlight
   - Print button
   - Continue learning button

## Usage

The tour automatically starts when the user first visits each screen. It will:
1. Show a dark overlay
2. Highlight the current element
3. Display a tooltip explaining it
4. **Speak the explanation in Arabic** (auto-generated)
5. Provide Next/Skip buttons

After completing or skipping the tour, it won't show again (saved in localStorage).

## How It Works

```javascript
// Tour starts automatically on first visit
if (GuidedTour.shouldAutoStart('dashboard')) {
    setTimeout(() => GuidedTour.startTour('dashboard'), 1000);
}

// Text-to-speech reads the tour text
TextToSpeech.speak('مرحباً بك في التطبيق', {
    rate: 0.9,  // Speaking speed
    pitch: 1,   // Voice pitch
    volume: 0.8 // Volume level
});
```

## Benefits

✅ **No audio files needed** - Speech generated automatically
✅ **Interactive and visual** - Highlights exactly what it's explaining
✅ **User-friendly** - Can skip anytime
✅ **Comprehensive** - Covers all features across all screens
✅ **Arabic support** - Uses best available Arabic voice
✅ **Smart auto-start** - Shows once per screen, then remembers

## Manual Tour Reset

To see the tour again during development/testing:
```javascript
localStorage.removeItem('tourCompleted');
```
Then refresh the app.
