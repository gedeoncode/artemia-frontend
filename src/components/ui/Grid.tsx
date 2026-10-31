export const Grid = ({ children, cols = 2, gap = 4 }) => {
  const gridCols = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[cols]} gap-${gap} my-8`}>
      {children}
    </div>
  );
};
