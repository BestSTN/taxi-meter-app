import haversine from "haversine-distance";
import { useState } from "react";
import Modal from "./Modal";

const coordinate = [
  { lat: 13.809415403098289, lng: 100.55840220568498 },
  { lat: 13.80959330017594, lng: 100.55799003263849 },
  { lat: 13.80512374148099, lng: 100.55518496688458 },
  { lat: 13.80160881858215, lng: 100.55295835876878 },
  { lat: 13.79788008513218, lng: 100.55095384383809 },
  { lat: 13.797633291527225, lng: 100.54575917137794 },
  { lat: 13.79766057756377, lng: 100.5410443837164 },
  { lat: 13.793411087493636, lng: 100.53892707052346 },
  { lat: 13.791711147786113, lng: 100.53816479006336 },
  { lat: 13.790614414477435, lng: 100.53779777097107 },
  { lat: 13.789298334990253, lng: 100.53717666827289 },
  { lat: 13.785075887615607, lng: 100.53542629635416 },
  { lat: 13.780195328835077, lng: 100.53339360468436 },
  { lat: 13.777672769942082, lng: 100.53274429178595 },
  { lat: 13.773467409393819, lng: 100.53243956921918 },
  { lat: 13.769478165488664, lng: 100.52902832649178 },
  { lat: 13.759876801100635, lng: 100.52526918805158 },
  { lat: 13.751559889980143, lng: 100.52213674997857 },
  { lat: 13.743242118386652, lng: 100.52018714822887 },
  { lat: 13.737990986602577, lng: 100.51945870840392 },
  { lat: 13.736784322883135, lng: 100.51906346404603 },
  { lat: 13.736180988189775, lng: 100.52030565586031 },
  { lat: 13.735879311180376, lng: 100.52166077207275 },
  { lat: 13.737250519199996, lng: 100.52191487051195 },
  { lat: 13.738868541771424, lng: 100.52228190380497 },
  { lat: 13.738841096077627, lng: 100.52372173712571 },
  { lat: 13.738703947019848, lng: 100.52507687616118 },
  { lat: 13.74059621371918, lng: 100.52538748148095 },
  { lat: 13.74232393667602, lng: 100.52581102264595 },
  { lat: 13.743585453928848, lng: 100.52609339392531 },
  { lat: 13.743174047358147, lng: 100.52773089179419 },
  { lat: 13.742844908776846, lng: 100.5292272339987 },
  { lat: 13.742844868217377, lng: 100.53041303497284 },
  { lat: 13.744740747986864, lng: 100.53047618086708 },
];

function Meter({
  distance,
  duration,
  price,
  onSetDistance,
  onSetDuration,
  onSetPrice,
  onSetSteps,
  onSetCenter,
  clearDirection,
  onSetOrigin,
  onSetDestination,
}) {
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [openModal, setOpenModal] = useState(false);

  let locations = [];

  const handleOnStart = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locations = [
          // {
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude,
          // },

          // ** hardcode **
          coordinate[0],
        ];
        setStart(true);
        onSetDistance(0);
        onSetDuration(0);
        onSetPrice(40);

        // ** hardcode **
        let i = 1;

        setIntervalId(
          setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // const newLocation = {
                //   lat: position.coords.latitude,
                //   lng: position.coords.longitude,
                // };
                // locations = [...locations, newLocation]

                // locations = [
                //   ...locations,
                //   {
                //     lat:
                //       [...locations][locations.length - 1].lat +
                //       Math.random() / 100,
                //     lng:
                //       [...locations][locations.length - 1].lng +
                //       Math.random() / 100,
                //   },
                // ];

                // ** hardcode **
                locations = [...locations, coordinate[i]];
                i++;

                onSetSteps(locations);
                onSetCenter(locations[locations.length - 1]);

                const newdistance =
                  haversine(
                    locations[locations.length - 1],
                    locations[locations.length - 2]
                  ) / 1000;

                const timeFare = () => {
                  if (newdistance / 0.06 < 6) {
                    return 3;
                  } else return 0;
                };

                console.log("*****");
                console.log(newdistance + " km");
                console.log("6.5 baht/km =" + newdistance * 6.5 + " baht");
                console.log(newdistance / 0.06 + " km/hr");
                console.log("speed < 6km/hr = " + timeFare() + " baht");

                onSetDistance((distance) => distance + newdistance);
                onSetDuration((time) => time + 1);
                onSetPrice((fare) => fare + newdistance * 6.5 + timeFare());
              },
              () => alert("can not get your location")
            );
          }, 1000)
        );
      },
      () => alert("can not get your location")
    );
  };

  const handleOnStop = () => {
    setStart(false);
    clearInterval(intervalId);
    setOpenModal(true);
  };

  const handleOnClear = () => {
    onSetDistance(0);
    onSetDuration(0);
    onSetPrice(0);
    onSetSteps();
    clearDirection();
    locations = [];
    setOpenModal(false);
    onSetOrigin();
    onSetDestination();
  };

  return (
    <div className="flex flex-col p-5 bg-slate-200 gap-2 z-10 shadow-xl">
      <div className="text-m font-bold">DISTANCE (km)</div>
      <div className="text-3xl ">{parseFloat(distance).toFixed(2)}</div>
      <div className="text-m font-bold">DURATION (minute)</div>
      <div className="text-3xl ">{duration}</div>
      <div className="text-2xl font-bold">PRICE (baht)</div>
      <div className="text-8xl font-bold text-red-500">
        {parseFloat(price).toFixed(2)}
      </div>

      {start ? (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
          onClick={handleOnStop}
        >
          STOP
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={handleOnStart}
        >
          START
        </button>
      )}
      <Modal price={price} open={openModal} close={handleOnClear}></Modal>
    </div>
  );
}

export default Meter;
