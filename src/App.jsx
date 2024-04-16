// import { useEffect, useState } from "react";
import Shake from '@zouloux/shake';
import { useEffect, useState } from 'react';

function requestDeviceMotion(callback) {
  if (window.DeviceMotionEvent == null) {
    callback(new Error("DeviceMotion is not supported."));
  } else if (DeviceMotionEvent.requestPermission) {
    DeviceMotionEvent.requestPermission().then(function (state) {
      if (state == "granted") {
        callback(null);
      } else callback(new Error("Permission denied by user"));
    }, function (err) {
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


const App = () => {
  const [shakesCount, setShakesCount] = useState(0);
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const [event, setEvent] = useState(null);



  useEffect(() => {
    
  }, [])


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
        window.addEventListener("devicemotion", (event) => {
          setEvent(event);
          console.log(event)
          setAcceleration({
            x: event.accelerationIncludingGravity.x,
            y: event.accelerationIncludingGravity.y,
            z: event.accelerationIncludingGravity.z
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
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center">
      <div className='flex flex-col gap-3 p-3 bg-white shadow-sm rounded-lg'>
        <div className='flex gap-3 items-center'>
          <p>Shake me!!!</p>
          <p>
            {shakesCount}
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          <p>Acceleration x: 
            {(acceleration.x !== undefined && acceleration.x !== null) ? acceleration.x.toFixed(2) : ' no data'}
          </p>

          <p>Acceleration y:
            {(acceleration.x !== undefined && acceleration.x !== null) ? acceleration.y.toFixed(2) : ' no data'}
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
          <button onClick={handleRequestPermissions}>Request Permissions</button>
        </div>
      </div>
    </div>
  )
}

export default App;