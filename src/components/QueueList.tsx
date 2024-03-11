type QueueListProps = {
  queuedVideos: string[];
};

export default function QueueList({ queuedVideos }: QueueListProps) {
  return (
    <div className="flex flex-col justify-start items-center min-h-52">
      {queuedVideos.length > 1 && (
        <>
          <h1 className="font-bold">Queued Youtube Videos</h1>
          <ul className="flex flex-col">
            {queuedVideos.map((videoLink, index) => {
              if (index > 0) return <li key={index}>{videoLink}</li>;
            })}
          </ul>
        </>
      )}
      {queuedVideos.length <= 1 && (
        <h1 className="font-bold">Nothing Queued!</h1>
      )}
    </div>
  );
}
