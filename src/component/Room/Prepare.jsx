import { useEffect, useState, useRef, useCallback } from "react";

const Prepare = () => {
  const videoRef = useRef(null);
  const [source, setSource] = useState(null);
  const [select, setSelect] = useState({
    audioinput: {
      value: undefined,
      options: [],
    },
    audiooutput: {
      value: undefined,
      options: [],
    },
    videoinput: {
      value: undefined,
      options: [],
    },
  });

  const setDevices = async () => {
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    setSelect((preSelect) =>
      deviceInfos.reduce((pre, deviceInfo) => {
        return {
          ...pre,
          [deviceInfo.kind]: {
            value: pre[deviceInfo.kind].value ? pre[deviceInfo.kind].value : deviceInfo.deviceId,
            options: [...pre[deviceInfo.kind].options, deviceInfo],
          },
        };
      }, preSelect)
    );
  };

  const getStream = async (audioinput, videoinput) => {
    const constraints = {
      audio: {
        deviceId: audioinput ? { exact: audioinput } : undefined,
      },
      video: {
        deviceId: videoinput ? { exact: videoinput } : undefined,
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setSource(stream);
      videoRef.current.srcObject = stream;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const stopStream = useCallback(() => {
    source?.getTracks().forEach((track) => track.stop());
  }, [source]);

  const initializes = async () => {
    const stream = await getStream();
    if (stream) {
      await setDevices();
    }
  };

  useEffect(() => {
    initializes();

    return () => {
      stopStream();
    };
  }, []);

  useEffect(() => {
    if (select.audiooutput.value || select.videoinput.value) {
      console.log("change input");
      stopStream();
      getStream(select.audioinput.value, select.videoinput.value);
    }
  }, [select.audioinput.value, select.videoinput.value]);

  useEffect(() => {
    if (select.audiooutput.value) {
      console.log("change output");
      videoRef.current
        .setSinkId(select.audiooutput.value)
        .then(() => {
          console.log(`Success, audio output device attached: ${select.audiooutput.value}`);
        })
        .catch((error) => {
          let errorMessage = error;
          if (error.name === "SecurityError") {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
          // Jump back to first output device in the list as it's the default.
          setSelect((pre) => ({
            ...pre,
            audiooutput: {
              ...pre.audiooutput,
              value: pre.audiooutput.options[0].deviceId,
            },
          }));
        });
    }
  }, [select.audiooutput.value]);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='flex w-10/12 h-4/6 space-x-4'>
        <div className='bg-black h-full flex-grow'>
          <video className='w-full h-full' ref={videoRef} autoPlay></video>
        </div>
        <div className='min-w-[300px] flex flex-col space-y-4'>
          <div className='flex flex-col space-y-4'>
            {["audioinput", "audiooutput", "videoinput"].map((item) => (
              <div key={item}>
                <div>{item} :</div>
                <select
                  className='w-full py-1 px-2 border border-gray-600'
                  value={select[item].value}
                  onChange={(e) => {
                    setSelect((pre) => ({
                      ...pre,
                      [item]: {
                        ...pre[item],
                        value: e.target.value,
                      },
                    }));
                  }}
                >
                  {select[item].options.map(({ deviceId, label }) => (
                    <option key={deviceId} value={deviceId}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className='w-min ml-auto' onClick={() => {}}>
            Start
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prepare;
