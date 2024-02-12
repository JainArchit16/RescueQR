export default function Tab({ tabData, field, setField }) {
  return (
    <div
      style={{
        boxShadow: "inset 1px 1px 1px 1px rgba(255, 255, 255, 0.18)",
      }}
      className="flex p-1 gap-x-1 my-6 rounded-full w-full"
    >
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${
            field !== tab.type
              ? "bg-[#0842a0] text-white"
              : "bg-white text-black"
          } py-2 px-5 rounded-full transition-all duration-200 w-full`}
        >
          {tab?.tabName}
        </button>
      ))}
    </div>
  );
}
