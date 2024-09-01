import { ISample } from "@/app/page";
import { NoteNode } from "./NoteNode";

export let Sampler = ({ samples }: { samples: ISample[] }) => (
  <div>
    {samples.map((sample) => (
      <div key={"1"}>
        <NoteNode audio={sample.url} />
        <br />
      </div>
    ))}
  </div>
);
