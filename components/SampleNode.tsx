import { useEffect, useState } from "react";
import { ISample, playNoteChannel } from "./Sampler";
import { NoteNode } from "./NoteNode";

export let SampleNode = ({
  node,
  sequenceShowing,
  curIndex,
}: {
  node: ISample;
  sequenceShowing: number;
  curIndex: number;
}) => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [name, setName] = useState("Sample " + node.id);
  const [sequence, setSequence] = useState(node.Sequence);
  let play = new Audio(node.url);

  const handleEnabled = (id: number, enabled: boolean) => {
    node.Sequence[sequenceShowing][id] = enabled;
    let fakeSeq = [...sequence];
    fakeSeq[sequenceShowing][id] = enabled;
    setSequence(fakeSeq);
  };

  const handleVolume = (newVol: number) => {
    setVolume(newVol);
    play.volume = volume;
    if (volume === 0) setMuted(true);
  };

  const handleMute = () => {
    setMuted(!muted);
    play.volume = muted ? volume : 0;
  };

  const start = () => {
    if (!muted) {
      play.volume = volume;
      play.play();
    }
  };

  // useEffect(() => {
  //   const playAudio = (index: number) => {
  //     console.log("index", index);
  //     // if (!muted && node.Sequence[sequenceShowing][index] == true) {
  //     if (!muted && sequence[sequenceShowing][index]) {
  //       play.volume = volume;
  //       play.play();
  //     }
  //   };

  //   const unsubOnPlayNote = playNoteChannel.on(
  //     "onPlayNote",
  //     (index: number) => {
  //       playAudio(index);
  //     }
  //   );

  //   return () => {
  //     unsubOnPlayNote();
  //   };
  // }, [node]);

  const playAudio = (index: number) => {
    console.log("index", index);
    // if (!muted && node.Sequence[sequenceShowing][index] == true) {
    if (!muted && sequence[sequenceShowing][index]) {
      play.volume = volume;
      play.play();
    }
  };

  useEffect(() => {
    playAudio(curIndex);
  }, [curIndex]);

  return (
    <div className="flex-row flex -mb-6 align-middle">
      <div className="SoundHolder w-64 align-middle align-text-middle flex text-white p-5 ">
        {/* Name / Play */}
        <button
          onClick={start}
          className=" pl-2 pr-4"
          // className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded mt-10"
        >
          {name}
        </button>
        {/* Mute */}
        <button onClick={handleMute} className="pr-1">
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
          className="accent-white mr-3 w-20"
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolume(parseFloat(e.target.value))}
        />
      </div>
      <div className="SamplerBackground  min-w-fullflex-row flex p-5 ml-10">
        {node.Sequence[sequenceShowing].map((note, id) => (
          <div key={id} className="">
            <NoteNode
              id={id}
              handleEnabled={handleEnabled}
              enabled={note}
              curIndex={curIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
