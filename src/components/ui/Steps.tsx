export const Steps = ({ children }) => {
  return (
    <div className="relative ml-4 border-l-2 border-slate-200 pl-8 py-2 space-y-12">
      {children}
    </div>
  );
};

export const Step = ({ title, children }) => {
  return (
    <div className="relative">
      {/* The Numbered Dot */}
      <div className="absolute -left-[41px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white">
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mt-0">{title}</h3>
        <div className="text-slate-600 mt-2 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
