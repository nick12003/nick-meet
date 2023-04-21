const Loading = () => {
  return (
    <div className='h-full flex items-center justify-center'>
      <div className='flex flex-col items-center justify-center text-center  '>
        <div className='flex mb-[20px] '>
          <div className='m-[2px] w-[12px] h-[12px] bg-primary/30 rounded-[50%] animate-Loading' />
          <div className='m-[2px] w-[12px] h-[12px] bg-primary/60 rounded-[50%] animate-Loading animationDelay-100' />
          <div className='m-[2px] w-[12px] h-[12px] bg-primary/90 rounded-[50%] animate-Loading animationDelay-200' />
        </div>
        <div className='text-transparent bg-clip-text bg-gradient-to-r from-transparent via-transparent to-primary animate-LoadingText'>
          <h1 className='text-4xl mb-4'>Loading...</h1>
          <p>please wait</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
