## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Checklist

- [x] Create a snippet
  - [x] Based on time
  - [x] Turn into a component
- [x] Create custom audio player
- [x] Create mpc
  - [x] Add playing
  - [x] Add volume controls
  - [x] Add ability to see which notes are playing
  - [x] Add Sequencer input
  - [x] Add bpm input
- [ ] Add support for other formats
- [ ] may need to look out for regions start and end time with min max
- [x] Styling

# Bugs

- [ ] Fix refresh on trim
- [ ] Fix Player looping
- [ ] Chopper wont change playing state icon if u click on it
- [ ] Fix default trim time not working
- [x] What happens if no sequence enabled?
- [x] Wont play if sound is currently playing
- [ ] Fix leading zero in BPM
- [ ] Sequencer causes stutter / pause
- [x] Number input trimming and editing
- [ ] When reset index, still plays audio due to not knowing when play is enabled
- [ ] Maybe break some of the components out, such as BPM

- The AudioContext encountered an error from the audio device or the WebAudio renderer. Display restart your computer

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
