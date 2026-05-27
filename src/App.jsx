import { useState } from "react";

import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";

import AboutPage from "./pages/AboutPage";

import LAYER_CONFIG from "./components/layerConfig";

export default function App() {
  const [layers, setLayers] = useState(
    Object.keys(LAYER_CONFIG).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const [activePage, setActivePage] =
    useState(null);

  return (
    <>
      <MapView layers={layers} />

      <Sidebar
        layers={layers}
        setLayers={setLayers}
        openPage={setActivePage}
      />

      {activePage === "about" && (
        <AboutPage
          onClose={() => setActivePage(null)}
        />
      )}
    </>
  );
}