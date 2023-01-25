import { useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import Map from "./components/Map";

function App() {
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <Map />
    </>
  );
}

export default App;
