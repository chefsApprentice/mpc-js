import { SampleNode } from "./SampleNode";

export interface ISample {
  id: number;
  url: string;
  // Name: string;
  // Volume: number;
  Sequence: boolean[][];
}

interface ISampler {
  Nodes: ISample[];
  Bpm: number;
  SequenceShowing: number;
  // playing : boolean
}

export let Sampler = ({ samples }: { samples: ISample[] }) => {
  return (
    <div className="-p-10 -mb-20">
      {samples.map((sample) => (
        <div key={"1"}>
          <SampleNode node={sample} sequenceShowing={0} />
          <br />
        </div>
      ))}
    </div>
  );
};
