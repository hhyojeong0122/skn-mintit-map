import React, { useCallback, useEffect, useState } from "react";
import { get } from "lodash";
import assets from "./constants/assets";
import useDebounce from "./hooks/useDebounce";

const { kakao } = window;

const GET_DIRECTIONS = "get_directions";
const FETCH_ATM_LIST = "fetch_atm_list";

function App() {
  const [map, setMap] = useState();
  const [event, setEvent] = useState();
  const [mapCenter, setMapCenter] = useDebounce();
  const [location, setLocation] = useState({
    latitude: 37.56859,
    longitude: 126.987162,
  });

  const postMessage = (type, data) => {
    const message = JSON.stringify({
      type: type,
      data: data,
    });
    window.ReactNativeWebView.postMessage(message);
  };

  //Marker 생성
  const createMarker = (atm) => {
    const { lat, lon, com_main_num } = atm;

    const image = createMarkerImage(com_main_num);
    const position = new kakao.maps.LatLng(lat, lon);
    const marker = new kakao.maps.Marker({
      image,
      position,
      clickable: true,
    });
    marker.atmInfo = atm;

    return marker;
  };

  // Marker 이미지 생성
  const createMarkerImage = (com_main_num) => {
    const size = new kakao.maps.Size(48, 48);
    const options = { offset: new kakao.maps.Point(24, 48) };
    let imgRender;

    switch (com_main_num) {
      case 1485: // SKT
        imgRender = assets.IC_PIN_SK;
        break;
      case 923: // 삼성
        imgRender = assets.IC_PIN_SAMSUNG;
        break;
      case 598: // 이마트
        imgRender = assets.IC_PIN_EMART;
        break;
      case 575: // 홈플러스
        imgRender = assets.IC_PIN_HOMEPLUS;
        break;
      case 998: // 롯데마트
        imgRender = assets.IC_PIN_LOTTE;
        break;
      case 4043: // 하이마트
        imgRender = assets.IC_PIN_HIMART;
        break;
      case 3978: // 우체국
        imgRender = assets.IC_PIN_POST;
        break;
      default:
        imgRender = assets.IC_PIN_MINTIT;
        break;
    }

    return new kakao.maps.MarkerImage(imgRender, size, options);
  };

  const handleNativeEvent = (event) => {
    const { type, data } = JSON.parse(event.data);

    setEvent({
      type: type,
      data: data,
    });

    if (type === "fetch_atm_list") {
      postMessage(type);
      return;
    }

    postMessage(type, data);
  };

  // Kakao map
  useEffect(() => {
    const container = document.getElementById("map");
    const { latitude, longitude } = location;
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    setMap(new kakao.maps.Map(container, options));
    postMessage("map_load_complete");
    postMessage("current location: ", location);

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

    switch (type) {
      case FETCH_ATM_LIST:
        const atmList = get(event, "data");
        const markers = atmList.map((atm) => createMarker(atm));
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 8,
        });
        clusterer.addMarkers(markers);
        markers.map((marker) => {
          marker.setMap(map);
          kakao.maps.event.addListener(marker, "click", () => {
            postMessage("click_marker", marker.atmInfo);
            const moveLatLng = new kakao.maps.LatLng(
              marker.atmInfo.lat,
              marker.atmInfo.lon
            );
            map.panTo(moveLatLng);
          });
        });
        break;

      case GET_DIRECTIONS:
        const latitude = parseFloat(get(event, "data.latitude", 10));
        const longitude = parseFloat(get(event, "data.longitude", 10));
        const moveLatLng = new kakao.maps.LatLng(latitude, longitude);
        map.setCenter(moveLatLng);
        map.panTo(moveLatLng);
        postMessage("get direction lat", latitude);
        postMessage("get direction lon", longitude);
        break;

      default:
        postMessage("not selected type");
        break;
    }
  }, [map, event]);

  useEffect(() => {
    if (map) {
      kakao.maps.event.addListener(map, "click", () => {
        postMessage("click_map");
      });
    }
  }, [map]);

  // **** Render **** //

  return (
    <div className="App">
      <div
        id="map"
        style={{
          width: "100vw",
          height: "100vh",
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
      {/*  <p>{event?.type}</p>*/}
      {/*  /!*<p>{event?.data}</p>*!/*/}
      {/*</div>*/}
    </div>
  );
}

export default App;
