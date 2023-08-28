import { API_URL } from "../utils/constants";
import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import SimpleAlertDialog from "../components/ui/AlertDialog";
import wavy_check from "../assets/CircleWavyCheck.svg";
import { GlowBluePrimary } from "../components/ui/Buttons";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { darkMode } from "../data/mapStyles";
import LoadingTrip from "../components/LoadingTrip";

const TripView = () => {
  let { tripId, duration } = useParams();
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [destination, setDestination] = useState("aitinerary");
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
          console.log(data);
          setDestination(data.preferences.destination);
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

    if (tripData && tripData.detailedItinerary[activeTabIndex].locations[0]) {
      setCenter({
        lat: tripData.detailedItinerary[activeTabIndex].locations[0].lat,
        lng: tripData.detailedItinerary[activeTabIndex].locations[0].lng,
      });
    }
  }, [activeTabIndex, tripData, mapInstance]);

  const onUnmount = useCallback(function callback() {
    setMapInstance(null);
  }, []);

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
    <div>
      {isLoading || !tripData || !tripData.detailedItinerary ? (
        <LoadingTrip destination={destination} />
      ) : (
        <div className="h-full relative">
          <div className="flex h-3/4">
            <div className="absolute top-0 left-0 lg:w-[40rem] h-[40rem] bg-[#535353] z-10 m-10 rounded-2xl overflow-y-auto shadow-xl">
              <div className="tabs-list-container custom-scrollbar flex flex-col h-full">
                <div className="flex-grow">
                  <Tabs.Root
                    value={activeTabIndex.toString()}
                    onValueChange={(value) => setActiveTabIndex(Number(value))}
                  >
                    <Tabs.List>
                      {tripData.detailedItinerary.map((item, index) => (
                        <Tabs.Trigger
                          key={index}
                          className="px-7 py-3 text-stone-400 text-sm"
                          value={index.toString()}
                        >
                          {item.day}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>
                    <Tabs.Content value={activeTabIndex.toString()}>
                      <div className="px-7 py-2">
                        <h1 className="text-base text-white">
                          {
                            tripData.detailedItinerary[activeTabIndex]
                              .detailedItinerary
                          }
                        </h1>
                      </div>
                    </Tabs.Content>
                  </Tabs.Root>
                </div>
              </div>
              <div className="bg-[white] bg-opacity-[30%] mx-4 px-[0.8rem] rounded-lg h-[3rem] flex items-center mt-4">
                <span className="text-white text-sm flex-shrink-0">
                  Does the response meet your expectations?
                </span>
                <div className="flex flex-grow justify-end space-x-2">
                  <SimpleAlertDialog
                    alertStyling={"bg-[#2b3c4d] bg-opacity-[70%]"}
                    title="Great, you can subscribe to our whitelist to get exclusive access to our full version!"
                    titleStyling={"text-white text-center text-xl mb-4"}
                    description={
                      <div className="max-sm:text-[0.7rem]">
                        <div className="bg-gradient-to-tr from-[#9bb0c5] to-[#616b77] ring-1 ring-white mx-4 px-[0.8rem] max-sm:px-[0.4rem] py-[1rem] space-y-2 max-sm:space-y-3 rounded-lg flex flex-col items-center text-white text-center">
                          <div className="flex items-center">
                            <img
                              src={wavy_check}
                              alt="check"
                              className="w-[20px] h-[20px] max-w-none"
                            />
                            <span className="ml-2">Early access</span>
                          </div>
                          <div className="flex items-center">
                            <img
                              src={wavy_check}
                              alt="check"
                              className="w-[20px] h-[20px] max-w-none"
                            />
                            <span className="ml-2">
                              Complete trip generation
                            </span>
                          </div>
                          <div className="flex items-center">
                            <img
                              src={wavy_check}
                              alt="check"
                              className="w-[20px] h-[20px] max-w-none"
                            />
                            <span className="ml-2">
                              An infinite number of refresh option
                            </span>
                          </div>
                          <div className="flex items-center">
                            <img
                              src={wavy_check}
                              alt="check"
                              className="w-[20px] h-[20px] max-w-none"
                            />
                            <span className="ml-2">
                              Complete trip modification
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center mx-4">
                          <GlowBluePrimary styling="mx-4 px-4 py-2 mt-4 rounded-lg md:max-w-[425px] max-md:w-full md:w-full justify-content">
                            Subscribe to the whitelist
                          </GlowBluePrimary>
                        </div>
                      </div>
                    }
                    mainButtonText="Yes"
                    mainButtonStyling={
                      "w-full ml-2 tap-highlight-none highlight-transparent"
                    }
                  />
                  <SimpleAlertDialog
                    alertStyling={"bg-[#2b3c4d] bg-opacity-[70%]"}
                    title="Let us know why?"
                    titleStyling={"text-white text-center text-xl mb-4"}
                    description={
                      <div className="space-y-4">
                        <div className="bg-[#C2E1FF] bg-opacity-[30%] max-sm:text-[0.7rem] mx-4 px-[0.8rem] max-sm:px-[0.5rem] py-[0.5rem] rounded-lg h-[2.5rem] items-center text-white text-center cursor-pointer">
                          I want to see other proposals
                        </div>
                        <div className="bg-[#C2E1FF] bg-opacity-[30%] max-sm:text-[0.7rem] mx-4 px-[0.8rem] max-sm:px-[0.5rem] py-[0.5rem] rounded-lg h-[2.5rem] items-center text-white text-center cursor-pointer">
                          Budget not respected
                        </div>
                        <div className="bg-[#C2E1FF] bg-opacity-[30%] max-sm:text-[0.7rem] mx-4 px-[0.8rem] max-sm:px-[0.5rem] py-[0.5rem] rounded-lg h-[2.5rem] items-center text-white text-center cursor-pointer">
                          Theme not respected
                        </div>
                        <div className="bg-[#C2E1FF] bg-opacity-[30%] max-sm:text-[0.7rem] mx-4 px-[0.8rem] max-sm:px-[0.5rem] py-[0.5rem] rounded-lg h-[2.5rem] items-center text-white text-center cursor-pointer">
                          Your problem does not appear?
                        </div>
                      </div>
                    }
                    mainButtonText="No"
                    mainButtonStyling={"w-full ml-2"}
                  />
                </div>
              </div>
            </div>
            <div className="relative z-5 w-full h-screen mt-[-8.5rem]">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    styles: darkMode,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripView;
