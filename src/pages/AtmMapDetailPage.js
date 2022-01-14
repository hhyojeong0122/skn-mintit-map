import React, { useCallback, useEffect, useState, useRef } from "react";
import actions from "../constants/actions";
import { get } from "lodash";
import { postMessage, createMarker, createMarkerImage } from "../utils";
const { kakao } = window;

export default function AtmDetailMapPage () {
  const [map, setMap] = useState();
  const [event, setEvent] = useState();
  const [location, setLocation] = useState({
    latitude: 37.57679573019775,
    longitude: 126.89785131995227,
  });

  const handleNativeEvent = (event) => {
    const { type, data } = JSON.parse(event.data);

    setEvent({ type: type, data: data });
    postMessage(type, data);
  };

  // Kakao map
  useEffect(() => {
    const container = document.getElementById("mapDetail");
    const { latitude, longitude } = location;
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      // draggable: false,
      level: 3,
    };
    setMap(new kakao.maps.Map(container, options));

    postMessage("map_load_complete");
    postMessage("current location: ", location)

    if (window.ReactNativeWebView) {
      document.addEventListener("message", handleNativeEvent);
      window.addEventListener("message", handleNativeEvent);
    }
    return () => {
      document.removeEventListener("message", handleNativeEvent);
      window.removeEventListener("message", handleNativeEvent);
    };
  }, []);

  useEffect(() => {
    const type = get(event, "type");
    const data = get(event, "data");
    const latitude =  parseFloat(get(event, "data.lat", 10));
    const longitude = parseFloat(get(event, "data.lon", 10));
    const latLng = new kakao.maps.LatLng(latitude, longitude);

    switch (type){
      case actions.FETCH_ATM:

        postMessage(actions.FETCH_ATM, data);
        const image = createMarkerImage(data.markerInfo.com_main_num, data.markerInfo.sts, true);
        const position = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({ image, position });
        marker.atmInfo = data;

        marker.setMap(map);
        map.setCenter(latLng);
        break;

      case actions.GET_ADDRESS:
        const geocoder = new kakao.maps.services.Geocoder();

        const callback = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            postMessage(actions.GET_ADDRESS, result);
          }
        };
        geocoder.coord2Address(latLng.getLng(), latLng.getLat(), callback);

        break;

      default:
        postMessage("not selected type");
        break;
    }
  }, [map, event])

  return (
    <>
      <div
        id="mapDetail"
        style={{
          width: "100vw",
          height: "100vh",
          // pointerEvents: "none"
        }}
      />
      {/*<div*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    zIndex: 10,*/}
      {/*    left: "50%",*/}
      {/*    top: "10%",*/}
      {/*    background: "white",*/}
      {/*    padding: 15,*/}
      {/*    transform: "translateX(-50%)",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <p>{JSON.stringify(event?.data)}</p>*/}
      {/*  <p>{event?.type}</p>*/}
      {/*</div>*/}
    </>
  )
}
