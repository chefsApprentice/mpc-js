import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { useRef, useEffect, useState } from "react";

export let AudioPlayer = ({ audioFile }: { audioFile: string }) => {
  const regions = RegionsPlugin.create();
  const waveSurferOptions = (ref: any) => ({
    container: "#waveform",
    hideScrollbar: false,
    waveColor: "#092527",
    progressColor: "#041011",
    plugins: [regions],
  });

  const waveFormRef = useRef(null);
  let waveSurfer: any = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [curTime, setCurTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");

  let formatTime = (seconds: number) => {
    let date = new Date(0);
    date.setSeconds(seconds);
    // Doesnt include hours
    return date.toISOString().substring(14, 19);
  };

  let handlePlayPause = () => {
    setPlaying(!playing);
    waveSurfer.current.playPause();
  };

  let handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    waveSurfer.current.setVolume(newVol);
    setMuted(newVol === 0);
  };

  let handleMute = () => {
    setMuted(!muted);
    waveSurfer.current.setVolume(muted ? volume : 0);
  };

  useEffect(() => {
    const options = waveSurferOptions(waveFormRef.current);
    waveSurfer.current = WaveSurfer.create(options);
    waveSurfer.current.load(audioFile);

    waveSurfer.current.on("ready", () => {
      setVolume(waveSurfer.current!.getVolume());
      setDuration(waveSurfer.current!.getDuration());
      setAudioFileName(audioFile.split("/").pop()!);
    });
    waveSurfer.current.on("decode", () => {});

    waveSurfer.current.on("audioprocess", () => {
      setCurTime(waveSurfer.current.getCurrentTime());
    });

    return () => {
      waveSurfer.current.un("audioprocess");
      waveSurfer.current.un("ready");
      waveSurfer.current.destroy();
    };
  }, [audioFile]);

  return (
    <div>
      <div className="controls">
        {/* You should add a link / download button */}

        {/* Loop */}
        <button onClick={() => setLooping(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>
        </button>
        {/* Play */}
        <button onClick={handlePlayPause}>
          {playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          )}
        </button>
        {/* Mute */}
        <button onClick={handleMute}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        </button>
        {/* Volume slider */}
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />
        <span>
          {formatTime(curTime)} : {formatTime(duration)}
        </span>
        <span>Volume: {Math.round(volume * 100)}%</span>
      </div>
      <div
        id="waveform"
        ref={waveFormRef}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#27C19A",
          borderRadius: "15px",
        }}
      ></div>
    </div>
  );
};
