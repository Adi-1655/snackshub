const SkeletonCard = () => {
  return (
    <div className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden">
      <div className="skeleton h-48 w-full" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
      <div className="p-6 space-y-3">
        <div className="skeleton h-4 w-20" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
        <div className="skeleton h-6 w-3/4" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
        <div className="skeleton h-4 w-full" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-20" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
          <div className="skeleton h-4 w-16" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
        </div>
        <div className="skeleton h-12 w-full rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
