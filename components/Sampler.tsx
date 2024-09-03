import { useEffect, useState } from "react";
import { SampleNode } from "./SampleNode";
import { eventbus } from "@/utils/eventBus";

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

  let samplerInfo: ISampler = { BPM: 80, SequenceShowing: 0 };

  // let playOneNote = (index: number) => {
  //   if (samples[curSequence].Sequence[index]) samples[curSequence].url;
  // };

  let playSequence = () => {
    playNoteChannel.emit("onPlayNote", curIndex);

    if (curIndex + 1 >= 8) {
      setCurIndex(0);
      // Search for next enabled Sequence
      let laterSequence = SequenceEnabled.slice(curSequence + 1);
      let findSeq = laterSequence.findIndex((seq) => seq == true);
      if (findSeq != -1) {
        setCurSequence(curSequence + 1 + findSeq);
        return;
      }

      let preSeq = SequenceEnabled.slice(0, curSequence);
      findSeq = preSeq.findIndex((seq) => seq == true);
      if (findSeq != -1) {
        setCurSequence(findSeq);
        return;
      }

      // curSequence is the same otherwise, we have already reset index
      return;
    }

    setCurIndex(curIndex + 1);
    console.log(curIndex);
  };

  let handlePlayPause = () => {
    setPlaying(!playing);
    if (!playing) return;

    playSequence();
  };

  // useEffect(() => {
  //   let delay = 60000 / BPM;
  //   const timePlay = setTimeout(() => playSequence, delay);

  //   return () => clearTimeout(timePlay);
  // }, [playing]);

  return (
    <div>
      <div>
        {/* Play / Pause */}
        <button onClick={handlePlayPause} className="bg-gray-200 p-2 m-2 ml-0">
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
        {/* Reset cur index*/}
        <button
          onClick={() => setCurIndex(0)}
          className="bg-gray-200  ml-0 m-2 p-2"
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
      </div>
      <div className="-p-10 -mb-20">
        {samples.map((sample) => (
          <div key={"1"}>
            <SampleNode node={sample} sequenceShowing={0} />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};
