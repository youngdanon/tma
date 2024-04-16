// import { useEffect, useState } from "react";
import Shake from '@zouloux/shake';
import { useEffect, useState } from 'react';

// /**
// * @param callback function(error)
// * @author YellowAfterlife
// **/
// function requestDeviceMotion(callback) {
//   if (window.DeviceMotionEvent == null) {
//     callback(new Error("DeviceMotion is not supported."));
//   } else if (DeviceMotionEvent.requestPermission) {
//     DeviceMotionEvent.requestPermission().then(function (state) {
//       if (state == "granted") {
//         callback(null);
//       } else callback(new Error("Permission denied by user"));
//     }, function (err) {
//       callback(err);
//     });
//   } else { // no need for permission
//     callback(null);
//   }
// }

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


  const myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 10, // optional, determines the frequency of event generation
    handler: () => {
      setShakesCount((prev) => prev + 1);
    }
  })


  useEffect(() => {
    myShakeEvent.start();
    return () => {
      myShakeEvent.stop();
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center">
      <div className="p-3 bg-white shadow-sm">
        Shake me!
      </div>
      <div className="p-3 bg-white shadow-sm">
        {shakesCount}
      </div>
    </div>
  )
}

export default App;