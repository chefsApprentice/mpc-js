import { useState } from "react";

export let NoteNode = ({
  id,
  enabled,
  handleEnabled,
}: {
  id: number;
  enabled: boolean;
  handleEnabled: any;
}) => {
  // let [fakeEnabled, setFakeEnabled] = useState(false);

  let handleSwitch = () => {
    handleEnabled(id, !enabled);
  };

  return (
    <button
      className={
        (enabled
          ? "RedAccent hover:bg-red-700  "
          : "SampleBackground hover:bg-gray-200") +
        " text-white py-5 px-5 ml-5 rounded "
      }
      onClick={handleSwitch}
    >
      {enabled}
    </button>
  );
};
