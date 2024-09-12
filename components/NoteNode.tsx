import { useState } from "react";

export let NoteNode = ({
  id,
  enabled,
  handleEnabled,
  curIndex,
}: {
  id: number;
  enabled: boolean;
  handleEnabled: any;
  curIndex: number;
}) => {
  // let [fakeEnabled, setFakeEnabled] = useState(false);

  let handleSwitch = () => {
    handleEnabled(id, !enabled);
  };

  return (
    <button
      className={
        (enabled && curIndex == id
          ? "bg-red-700 hover:bg-red-800  "
          : enabled
          ? "RedAccent hover:bg-red-700  "
          : curIndex == id
          ? "bg-gray-400 hover:bg-gray-500"
          : "SampleBackground hover:bg-gray-200") +
        " text-white py-5 px-5 ml-5 rounded "
      }
      onClick={handleSwitch}
    ></button>
  );
};
