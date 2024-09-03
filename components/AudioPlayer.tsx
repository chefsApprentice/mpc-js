import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  MutableRefObject,
} from "react";

export let AudioPlayer = ({
  audioFile,
  trimTime,
  setTrimming,
}: {
  audioFile: string;
  trimTime: MutableRefObject<number[]>;
  setTrimming: any;
}) => {
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
  const loopRef = useRef(looping);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [zoom, setZoom] = useState(0);
  const [duration, setDuration] = useState(0);
  const [curTime, setCurTime] = useState(0);

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

  let handleLoop = () => {
    setLooping(!looping);
    loopRef.current = !loopRef;
  };

  let handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    waveSurfer.current.zoom(Number(newZoom));
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

  let handleTrim = () => {
    setTrimming(true);
    // let region = regions.getRegions()[0];
    // console.log(regions.getRegions());
    // setTrim([region.start, region.end]);
  };

  useEffect(() => {
    const options = waveSurferOptions(waveFormRef.current);
    waveSurfer.current = WaveSurfer.create(options);
    waveSurfer.current.load(audioFile);

    waveSurfer.current.on("decode", () => {
      regions.addRegion({
        start: 0,
        end: 8,
        color: "rgba(0, 101, 79, 0.3)",
        drag: false,
        resize: true,
      });
    });

    {
      let activeRegion: any = null;
      regions.on("region-in", (region) => {
        activeRegion = region;
      });

      regions.on("region-out", (region) => {
        if (activeRegion === region) {
          if (loopRef.current) {
            region.play();
          } else {
            activeRegion = null;
          }
        }
      });

      regions.on("region-clicked", (region, e) => {
        e.stopPropagation(); // prevent triggering a click on the waveform
        activeRegion = region;
        region.play();
      });

      regions.on("region-updated", (region) => {
        trimTime.current = [region.start, region.end];
      });

      // Reset the active region when the user clicks anywhere in the waveform
      waveSurfer.current.on("interaction", () => {
        activeRegion = null;
      });
    }

    waveSurfer.current.on("ready", () => {
      setVolume(waveSurfer.current!.getVolume());
      setDuration(waveSurfer.current!.getDuration());
    });

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
    <div className="flex flex-row ">
      <div className="w-96 ">
        <div className="align-middle align-text-middle justify-center items-center">
          <div>
            <span className="float-right p-4">
              {formatTime(curTime)} : {formatTime(duration)}
            </span>
          </div>
          <div className="controls p-1 ml-3">
            {/* You should add a link / download button */}

            {/* Trim */}
            <button onClick={handleTrim} className="ButtonBg  ml-0 m-2 p-2">
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
                  d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
                />
              </svg>
            </button>

            {/* Loop */}
            <button
              onClick={handleLoop}
              id="looping"
              className="ButtonBg  ml-0 m-2 p-2"
              aria-label={"val:" + looping}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={looping ? "#27C19A" : "currentColor"}
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
            <button
              onClick={handlePlayPause}
              className="ButtonBg  ml-0 m-2 p-2"
            >
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
          </div>
        </div>
        <div
          id="waveform"
          ref={waveFormRef}
          style={{
            padding: 10,
            backgroundColor: "#27C19A",
            borderRadius: "15px",
          }}
        ></div>
        {/* Zoom */}
        <input
          type="range"
          className="accent-black w-96"
          id="zoom"
          name="zoom"
          min="0"
          max="50"
          step="0.1"
          value={zoom}
          onChange={(e) => handleZoom(parseFloat(e.target.value))}
        />
      </div>{" "}
      <div className="flex flex-col w-5 ml-2 p-5 justify align-middle align-text-middle justify-center items-center">
        {/* Mute */}
        <button onClick={handleMute} className="bg-gray-200 mb-5">
          {muted ? (
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
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </button>
        {/* Volume slider */}
        <input
          className="accent-red-500 vranger w-32 "
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />
        {/* <span className="mt-20">{Math.round(volume * 100)}%</span> */}
      </div>
    </div>
  );
};
