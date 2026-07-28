import error from "../../../assets/error.svg";

export const TestCaseWarningCard = () => {
  return (
    <div className="flex flex-col bg-[rgba(59,130,246,0.1)] border border-[#1f2937] border-l-4 border-l-[#3b82f6] rounded-tr-xl rounded-br-xl p-5 gap-2">
      <div className="flex items-center gap-2">
        <img src={error} />
        <p className="text-[#93c5fd]">About Test Cases</p>
      </div>
      <p className="text-sm ml-8">
        If you want the test case to have a line break at the end, be sure to
        add a{" "}
        <code className="bg-[#1f2937] text-[#e5e7eb] py-0.5 px-1.5 rounded-sm">
          {"\\n"}
        </code>{" "}
        at the end of the output
      </p>
    </div>
  );
};
