import { useState } from "react";

import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import AboutPage from "./pages/AboutPage";
import FormPanel from "./components/FormPanel";
import LAYER_CONFIG from "./components/layerConfig";

export default function App() {
  const [layers, setLayers] = useState(
    Object.keys(LAYER_CONFIG).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const [activePage, setActivePage] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  
  // Shared state: stores the { lat, lng, recenter } of the user's consultation
  const [consultationPoint, setConsultationPoint] = useState(null);

  return (
    <>
      <MapView 
        layers={layers} 
        consultationPoint={consultationPoint}
        onMapClick={(point) => {
          // Only capture clicks for consultation if the form is open
          if (formOpen) setConsultationPoint(point);
        }}
      />

      <Sidebar
        layers={layers}
        setLayers={setLayers}
        openPage={setActivePage}
        openForm={() => setFormOpen(true)}
      />

      <FormPanel
        open={formOpen}
        onClose={() => setFormOpen(false)}
        consultationPoint={consultationPoint}
        setConsultationPoint={setConsultationPoint}
      />

      {activePage === "about" && (
        <AboutPage onClose={() => setActivePage(null)} />
      )}
    </>
  );
}