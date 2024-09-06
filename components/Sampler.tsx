import { useEffect, useState } from "react";
import { SampleNode } from "./SampleNode";
import { eventbus } from "@/utils/eventBus";
import { SequenceNode } from "./SequenceNode";

export interface ISample {
  id: number;
  url: string;
  Sequence: boolean[][];
}

interface ISampler {
  // Nodes: ISample[];
  BPM: number;
  SequenceShowing: number;
  // playing : boolean
}

export const playNoteChannel = eventbus<{
  onPlayNote: (index: number) => void;
}>();

export let Sampler = ({ samples }: { samples: ISample[] }) => {
  const [playing, setPlaying] = useState(false);
  const [BPM, setBPM] = useState(80);
  // Technically could do this with just id, but this is easier
  const [curIndex, setCurIndex] = useState(0);
  const [curSequence, setCurSequence] = useState(0);
  const [SequenceEnabled, setSequenceEnabled] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [timerCount, setTimerCount] = useState(0);

  let samplerInfo: ISampler = { BPM: 80, SequenceShowing: 0 };

  // let playOneNote = (index: number) => {
  //   if (samples[curSequence].Sequence[index]) samples[curSequence].url;
  // };

  let handleSequence = (index: number) => {
    let fakeSeq = [...SequenceEnabled];
    fakeSeq[index] = !fakeSeq[index];
    setSequenceEnabled(fakeSeq);
  };

  let handleBPM = (newBPM: number) => {
    if (newBPM <= 10) setBPM(10);
    else if (newBPM >= 500) setBPM(500);
    else setBPM(newBPM);
  };

  let playSequence = () => {
    // console.log("Hi");
    // const loop = () => {
    if (!playing) return;
    // console.log("we made it");
    playNoteChannel.emit("onPlayNote", curIndex);

    if (curIndex + 1 >= 8) {
      setCurIndex(0);
      // Search for next enabled Sequence
      let laterSequence = SequenceEnabled.slice(curSequence + 1);
      let findSeq = laterSequence.findIndex((seq) => seq == true);
      if (findSeq != -1) {
        setCurSequence(curSequence + 1 + findSeq);
        // setTimeout(loop, delay);
        return;
      }

      let preSeq = SequenceEnabled.slice(0, curSequence);
      findSeq = preSeq.findIndex((seq) => seq == true);
      if (findSeq != -1) {
        setCurSequence(findSeq);
        // return;
        // setTimeout(loop, delay);
        return;
      }

      // curSequence is the same otherwise, we have already reset index
      // return;
      // setTimeout(loop, delay);
      return;
    }

    setCurIndex(curIndex + 1);
    console.log(curIndex);

    // return () => clearInterval(customInterval);
    // Kickstart
    // loop();
  };

  let handlePlayPause = () => {
    setPlaying(!playing);
    if (!playing) {
      setCurIndex(curIndex + 1);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      // playSequence();
    }
  };

  useEffect(() => {
    const delay = 60000 / BPM;
    // console.log("em" + curIndex);

    const timer = setInterval(() => {
      playSequence();
    }, delay);

    return () => clearInterval(timer);
  });

  return (
    <div className="absolute mt-2">
      {/* Sequencer */}
      <div className="grid grid-cols-4 w-64 mb-5 -ml-">
        {SequenceEnabled.map((sequence, id) => (
          <div key={id}>
            <SequenceNode
              index={id}
              handleSeq={handleSequence}
              seqState={sequence}
              setSelectedCur={setCurSequence}
              curSelected={curSequence}
            />
          </div>
        ))}
      </div>
      {/* Controls */}
      <div className="flex flex-row align-middle justify-center items-center align-text-middle w-64 ">
        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          className="RedAccent p-2 m-2 ml-0 text-white"
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
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        {/* Reset cur index*/}
        <button
          onClick={() => setCurIndex(0)}
          className="ButtonBg  ml-0 m-2 p-2"
        >
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
              d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
            />
          </svg>
        </button>
        {/* BPM */}
        <div className="flex flex-row ButtonBg p-2 w-26 h-10 mr-0">
          <input
            type="number"
            aria-describedby="increase bpm"
            placeholder="80"
            className="w-12 ButtonBg font-bold m-0 mb-0"
            value={BPM}
            onChange={(e) => handleBPM(Number(e.target.value))}
          ></input>
          <label className="font-bold">BPM</label>
        </div>
      </div>
      {/* Sampler */}
      <div className="-p-10 -mb-20">
        {samples.map((sample) => (
          <div key={"1"}>
            <SampleNode
              node={sample}
              sequenceShowing={curSequence}
              curIndex={curIndex}
            />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};
