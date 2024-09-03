import { useState } from "react";

export let NoteNode = ({
  id,
  handleEnabled,
}: {
  id: number;
  handleEnabled: any;
}) => {
  let [enabled, setEnabled] = useState(false);

  let handleSwitch = () => {
    handleEnabled(id, !enabled);
    setEnabled(!enabled);
  };

  return (
    <button
      className={
        (enabled
          ? "bg-red-600 hover:bg-red-700  "
          : "bg-gray-50 hover:bg-gray-200") +
        " text-white py-5 px-5 ml-5 rounded "
      }
      onClick={handleSwitch}
    ></button>
  );
};
