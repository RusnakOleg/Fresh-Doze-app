const TopBar = ({ telegramChannelLink, Flame }) => {
  return (
    <>
      <div className="sticky top-0 z-40 bg-[#008d7d] py-2.5 px-4 text-center shadow-inner">
        <a
          href={telegramChannelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] hover:opacity-85 transition-opacity"
        >
          <Flame
            size={17}
            strokeWidth={3}
            className="text-orange-500 animate-pulse shrink-0"
            style={{ animationDuration: "1.5s" }}
          />
          <span className="leading-none">Приєднатись до телеграм каналу</span>
        </a>
      </div>
    </>
  );
};

export default TopBar;
