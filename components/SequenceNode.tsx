export const SequenceNode = ({
  seqState,
  index,
  handleSeq,
  setSelectedCur,
  curSelected,
}: {
  seqState: boolean;
  index: number;
  handleSeq: any;
  setSelectedCur: any;
  curSelected: number;
}) => {
  const checkStyling = " ml-2 pl-2 pr-2";
  return (
    <div className="ml-4 mt-2 flex flex-row">
      <button
        className="w-5 outline-2 outline ring-black"
        onClick={() => handleSeq(index)}
      >
        {seqState ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        )}
      </button>
      <button
        className={
          curSelected == index
            ? "RedAccent " + checkStyling
            : "ButtonBg" + checkStyling
        }
        onClick={() => setSelectedCur(index)}
      >
        {index + 1}
      </button>
    </div>
  );
};
