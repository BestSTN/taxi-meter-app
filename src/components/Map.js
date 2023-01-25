import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import Places from "./Places";

function Map() {
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [directions, setDirections] = useState();
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [price, setPrice] = useState();

  const mapRef = useRef();

  const [center, setCenter] = useState({ lat: 13.75, lng: 100.5 });
  const options = useMemo(
    () => ({
      // mapId: "3713c985864a0e82",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("can not get your location")
    );
  }, []);

  const onMapLoad = useCallback((map) => (mapRef.current = map), []);

  const fetchDirections = useCallback(() => {
    if (!origin || !destination) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
          setPrice(
            Math.floor(
              35 + (result.routes[0].legs[0].distance.value / 1000) * 5
            )
          );
        }
      }
    );
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;
    fetchDirections();
  }, [origin, destination, fetchDirections]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col p-5 bg-slate-200 gap-2">
        <h1>
          <b>Origin</b>
        </h1>
        <Places
          setLocation={(position) => {
            setOrigin(position);
          }}
        />
        <h1>
          <b>Destination</b>
        </h1>
        <Places
          setLocation={(position) => {
            setDestination(position);
          }}
        />
      </div>

      <GoogleMap
        mapContainerClassName="h-full w-full"
        options={options}
        center={center}
        zoom={10}
        onLoad={onMapLoad}
      >
        {origin && (
          <Marker
            position={origin}
            draggable={true}
            onDragEnd={(e) =>
              setOrigin({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
            label={{ text: "A", color: "white", fontWeight: "700" }}
          />
        )}
        {destination && (
          <Marker
            position={destination}
            draggable={true}
            onDragEnd={(e) =>
              setDestination({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
            label={{ text: "B", color: "white", fontWeight: "700" }}
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              markerOptions: { visible: false },
            }}
          />
        )}
      </GoogleMap>
      {directions && (
        <div className="flex flex-col p-5 bg-slate-200 gap-2 z-10 shadow-xl">
          <h1>
            <b>Distance</b>: {distance}
          </h1>
          <h1>
            <b>Duration</b>: {duration}
          </h1>
          <h1>
            <b>Price</b>: {price} ฿
          </h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            START
          </button>
        </div>
      )}
    </div>
  );
}

export default Map;
