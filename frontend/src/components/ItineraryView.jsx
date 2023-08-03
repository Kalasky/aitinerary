import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../utils/constants";
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { darkMode } from "../data/mapStyles";

const ItineraryView = () => {
  let { tripId, duration } = useParams();
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);
  const [polylines, setPolylines] = useState([]);
  const [center, setCenter] = useState({
    lat: tripData ? tripData.detailedItinerary[0].locations[0].lat : 0,
    lng: tripData ? tripData.detailedItinerary[0].locations[0].lng : 0,
  });

  const markersRef = useRef([]);

  const { isLoaded } = useJsApiLoader({
    id: "cc03812a077ca56d",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const res = await fetch(`${API_URL}/trip/getTrip/${tripId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (
          !data.detailedItinerary ||
          data.detailedItinerary.length < duration
        ) {
          setTimeout(fetchTripData, 2000);
        } else {
          setTripData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to fetch trip data: ${error.message}`);
      }
    };
    fetchTripData();
  }, [tripId, setTripData, duration]);

  const onLoad = useCallback(
    function callback(map) {
      setMapInstance(map);
      const directionsService = new window.google.maps.DirectionsService();
      const bounds = new window.google.maps.LatLngBounds();
      const activeTabLocations =
        tripData.detailedItinerary[activeTabIndex].locations;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = activeTabLocations.map((location) => {
        bounds.extend(
          new window.google.maps.LatLng(location.lat, location.lng)
        );
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
        });
        return marker;
      });

      function calcRoute() {
        const start = new window.google.maps.LatLng(
          activeTabLocations[0].lat,
          activeTabLocations[0].lng
        );
        const end = new window.google.maps.LatLng(
          activeTabLocations[activeTabLocations.length - 1].lat,
          activeTabLocations[activeTabLocations.length - 1].lng
        );
        const waypts = [];
        for (let i = 1; i < activeTabLocations.length - 1; i++) {
          waypts.push({
            location: new window.google.maps.LatLng(
              activeTabLocations[i].lat,
              activeTabLocations[i].lng
            ),
            stopover: true,
          });
        }

        const request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: "DRIVING",
        };
        directionsService.route(request, function (result, status) {
          if (status === "OK") {
            drawRoute(map, result);
          }
        });
      }

      calcRoute();

      map.fitBounds(bounds);
    },
    [tripData, activeTabIndex]
  );

  const drawRoute = (map, result) => {
    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 4,
    };

    // Draw polylines based on the directions result
    const polyline = new window.google.maps.Polyline({
      path: result.routes[0].overview_path,
      strokeColor: "#A2D2FF",
      strokeWeight: 1,
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "20px",
        },
      ],
      map,
    });

    setPolylines((prev) => [...prev, polyline]);
  };

  useEffect(() => {
    if (mapInstance) {
      polylines.forEach((polyline) => polyline.setMap(null));
      setPolylines([]);

      markersRef.current.forEach((marker) => marker.setMap(null));
    }

    if (
      mapInstance &&
      tripData &&
      tripData.detailedItinerary[activeTabIndex].locations
    ) {
      onLoad(mapInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, tripData]);

  const onUnmount = useCallback(function callback() {
    setMapInstance(null);
  }, []);

  useEffect(() => {
    if (mapInstance) {
      polylines.forEach((polyline) => polyline.setMap(null));
      setPolylines([]);

      markersRef.current.forEach((marker) => marker.setMap(null));
    }

    if (
      mapInstance &&
      tripData &&
      tripData.detailedItinerary[activeTabIndex].locations
    ) {
      onLoad(mapInstance);
    }

    if (tripData && tripData.detailedItinerary[activeTabIndex].locations[0]) {
      setCenter({
        lat: tripData.detailedItinerary[activeTabIndex].locations[0].lat,
        lng: tripData.detailedItinerary[activeTabIndex].locations[0].lng,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, tripData, mapInstance]);

  useEffect(() => {
    if (mapInstance && tripData) {
      const bounds = new window.google.maps.LatLngBounds();
      const activeTabLocations =
        tripData.detailedItinerary[activeTabIndex].locations;

      activeTabLocations.forEach((location) => {
        bounds.extend(
          new window.google.maps.LatLng(location.lat, location.lng)
        );
      });

      setTimeout(() => {
        mapInstance.fitBounds(bounds);
      }, 0);
    }
  }, [activeTabIndex, mapInstance, tripData]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {isLoading || !tripData || !tripData.detailedItinerary ? (
        <p>Loading...</p>
      ) : (
        <Box display="flex" height="100%">
          <Box width="30%">
            <Tabs onChange={(index) => setActiveTabIndex(index)}>
              <TabList>
                {tripData.detailedItinerary.map((item, index) => (
                  <Tab key={index}>{item.day}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {tripData.detailedItinerary.map((item, index) => (
                  <TabPanel key={index}>
                    <p>{item.detailedItinerary}</p>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
          <Box width="70%">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{ styles: darkMode, mapTypeControl: false }}
              />
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ItineraryView;
