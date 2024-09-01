export let NoteNode = ({ audio }: { audio: string }) => {
  const start = () => {
    console.log("clkicked");
    if (audio) {
      console.log("hi");
      let play = new Audio(audio);
      play.play();
    }
  };

  return (
    <button
      onClick={start}
      className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded mt-10"
    >
      Play
    </button>
  );
};
