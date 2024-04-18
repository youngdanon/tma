// import { useEffect, useState } from "react";
/** @ts-expect-error  no type defs */
import Shake from '@zouloux/shake';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useContainerDimensions } from './hooks/useContainerDimensions';

function requestDeviceMotion(callback: (error: Error | null) => void) {
  if (window.DeviceMotionEvent == null) {
    callback(new Error("DeviceMotion is not supported."));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if ((DeviceMotionEvent as any).requestPermission) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (DeviceMotionEvent as any).requestPermission().then(function (state: string) {
      if (state == "granted") {
        callback(null);
      } else callback(new Error("Permission denied by user"));
    }, function (err: Error) {
      callback(err);
    });
  } else { // no need for permission
    callback(null);
  }
}

// const App = () => {
//   const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });



//   useEffect(() => {
//     requestDeviceMotion((err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         window.addEventListener("devicemotion", (event) => {
//           setAcceleration({
//             x: event.acceleration.x,
//             y: event.acceleration.y,
//             z: event.acceleration.z
//           })
//           console.log(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
//         });
//       }
//     });
//   }, [])



//   return (
//     <div 
//       className="w-screen h-screen bg-gray-900 flex justify-center items-center"
//     >
//       <div className="p-3 bg-white shadow-sm">
//         x: {String(acceleration.x?.toFixed(2))}<br />
//         y: {String(acceleration.y?.toFixed(2))}<br />
//         z: {String(acceleration.z?.toFixed(2))}<br />
//       </div>
//     </div>
//   )
// }


// export default App;

type ChartData = {
  g: number;
  time: number;
}

const App = () => {
  const [shakesCount, setShakesCount] = useState(0);
  const [, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [event, setEvent] = useState<DeviceMotionEvent | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [max, setMax] = useState(0)
  const [min, setMin] = useState(Infinity)
  const [mean, setMean] = useState(0)

  const pageContainerRef = useRef<HTMLDivElement>(null)

  const { width } = useContainerDimensions(pageContainerRef)

  useEffect(() => {
    if (event) {
      const { acceleration } = event;
      const x = Math.abs(acceleration?.x ?? 0);
      const y = Math.abs(acceleration?.y ?? 0);
      const z = Math.abs(acceleration?.z ?? 0);

      const newG = Math.sqrt(x * x + y * y + z * z) / 9.8

      if (newG > max) {
        setMax(newG)
      }
      if (newG < min) {
        setMin(newG)
      }

      setChartData((prev) => {
        const newTime = prev.length !== 0 ? prev[prev.length - 1].time + 100 : 0
        const newChartData = [...prev, { g: newG, time: newTime }];
        if (newChartData.length > 300) {
          newChartData.shift();
        }
        const mean = newChartData.map((elem) => elem.g).reduce((acc, curr) => acc + curr, 0) / newChartData.length;
        setMean(mean);

        return newChartData;
      })
    }
  }, [event])

  const windowSize = 5;

  const smoothedData = useMemo(() => {
    const smoothed: ChartData[] = [];
    for (let i = 0; i < chartData.length; i++) {
      let sumG = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(chartData.length - 1, i + windowSize); j++) {
        sumG += chartData[j].g;
        count++;
      }
      const smoothedValue = sumG / count;
      smoothed.push({ g: smoothedValue, time: chartData[i].time });
    }
    return smoothed;
  }, [chartData])





  const myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 10, // optional, determines the frequency of event generation
    handler: () => {
      setShakesCount((prev) => prev + 1);
    }
  })

  const handleRequestPermissions = () => {
    requestDeviceMotion((err) => {
      if (err) {
        console.error(err);
      } else {
        window.addEventListener("devicemotion", (event: DeviceMotionEvent) => {
          setEvent(event);
          console.log(event)
          setAcceleration({
            x: event.accelerationIncludingGravity?.x ?? 0,
            y: event.accelerationIncludingGravity?.y ?? 0,
            z: event.accelerationIncludingGravity?.z ?? 0
          })
        });
      }
    });
  }


  useEffect(() => {
    myShakeEvent.start();
    return () => {
      myShakeEvent.stop();
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center overflow-auto" ref={pageContainerRef}>
      <div className='flex flex-col gap-3 p-3 bg-white shadow-sm rounded-lg'>
        <button onClick={handleRequestPermissions}>Request Permissions</button>
        <div className='flex gap-3 items-center'>
          <p>Shake me!!!</p>
          <p>
            {shakesCount}
          </p>
        </div>
        <LineChart width={width - 30} height={200} data={chartData}>
          <Line type="monotone" dataKey="g" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
        </LineChart>
        <LineChart width={width - 30} height={200} data={smoothedData}>
          <Line type="monotone" dataKey="g" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
        </LineChart>

        <div className='flex flex-col gap-3'>
          <p>Max G: {max.toFixed(2)}</p>
          <p>Min G: {min.toFixed(2)}</p>
          <p>Mean G: {mean.toFixed(2)}</p>
        </div>
        {/* <div className='flex flex-col gap-3'>
          <p>Acceleration x: 
            {(acceleration.x !== undefined && acceleration.x !== null) ? acceleration.x.toFixed(2) : ' no chartData'}
          </p>

          <p>Acceleration y:
            {(acceleration.x !== undefined && acceleration.x !== null) ? acceleration.y.toFixed(2) : ' no chartData'}
          </p>
          {event && (
            <>
              <p>
                event.rotationRate.alpha : {event?.rotationRate?.alpha?.toFixed(2)}<br/>
                event.rotationRate.beta : {event?.rotationRate?.beta?.toFixed(2)}<br/>
                event.rotationRate.gamma : {event?.rotationRate?.gamma?.toFixed(2)}
              </p>
              <p>
                acceleration.x : {event?.acceleration.x?.toFixed(2)}<br/>
                acceleration.y : {event?.acceleration.y?.toFixed(2)}<br/>
                acceleration.z : {event?.acceleration.z?.toFixed(2)}
              </p>
              <p>
                accelerationIncludingGravity.x : {event?.accelerationIncludingGravity.x?.toFixed(2)}<br/>
                accelerationIncludingGravity.y : {event?.accelerationIncludingGravity.y?.toFixed(2)}<br/>
                accelerationIncludingGravity.z : {event?.accelerationIncludingGravity.z?.toFixed(2)}
              </p>

            </>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default App;