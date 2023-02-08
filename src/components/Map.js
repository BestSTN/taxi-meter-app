import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import Header from "./Header";
import Meter from "./Meter";

function Map() {
  const [center, setCenter] = useState({ lat: 13.75, lng: 100.5 });
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [directions, setDirections] = useState();
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [price, setPrice] = useState();
  const [steps, setSteps] = useState();

  const mapRef = useRef();

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
      <Header
        onSetOrigin={(position) => setOrigin(position)}
        onSetDestination={(postition) => setDestination(postition)}
        onSetCenter={(position) => setCenter(position)}
      />

      <GoogleMap
        mapContainerClassName="h-full w-full"
        options={options}
        center={center}
        zoom={15}
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
              preserveViewport: true,
            }}
          />
        )}
        {steps && (
          <>
            <Marker position={center} />
            <Polyline
              path={steps}
              options={{ strokeColor: "#FF0000", strokeWeight: 10, zIndex: 20 }}
            />
          </>
        )}
      </GoogleMap>
      {directions && (
        <Meter
          distance={distance}
          onSetDistance={setDistance}
          duration={duration}
          onSetDuration={setDuration}
          price={price}
          onSetPrice={setPrice}
          onSetSteps={(position) => setSteps(position)}
          onSetCenter={(position) => setCenter(position)}
          onSetOrigin={(position) => setOrigin(position)}
          onSetDestination={(postition) => setDestination(postition)}
          clearDirection={() => setDirections()}
        />
      )}
    </div>
  );
}

export default Map;
