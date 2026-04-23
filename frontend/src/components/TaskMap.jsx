import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const LocateButton = ({ setUserLocation }) => {
  const map = useMap();

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = [latitude, longitude];
          setUserLocation(pos);
          map.flyTo(pos, 13);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button 
        onClick={(e) => { e.preventDefault(); handleLocateMe(); }}
        className="bg-white hover:bg-gray-100 p-2 flex items-center justify-center rounded-md shadow-md border border-gray-200 transition-colors"
        title="Locate me"
      >
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21l-9-4 9-14 9 14-9 4z" />
        </svg>
      </button>
    </div>
  );
};

const TaskMap = () => {
  const initialPosition = [-46.1028, 168.9436]; // Gore, New Zealand
  const [userLocation, setUserLocation] = useState(null);

  return (
    <div className="h-full w-full relative">
      <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0 relative" style={{ height: '100%', minHeight: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateButton setUserLocation={setUserLocation} />
        
        {/* Mock Task Marker */}
        <Marker position={initialPosition}>
          <Popup>
            A task is here.
          </Popup>
        </Marker>

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              You are here.
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TaskMap;
