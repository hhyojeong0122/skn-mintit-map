import React, { useCallback, useEffect, useRef, useState } from "react";
import { get } from "lodash";
import useDebounce from "./hooks/useDebounce";
import assets from "./constants/assets";

const { kakao, ReactNativeWebView } = window;

function App() {
  const [map, setMap] = useState();
  const [message, setMessage] = useState("MESSAGE");
  const [atmList, setAtmList] = useState([]);
  const [event, setEvent] = useState()
  const [location, setLocation] = useState({
    latitude: 37.56859,
    longitude: 126.987162,
  });

  // RN => Webview (받음)
  const handleNativeEvent = useCallback((event) => {
    const dataString = JSON.parse(get(event, "data"));

    if (dataString) {
      const { data, type } = dataString;
      setEvent(type);
      postMessage(type);

      switch (type) {
        case "fetch_atm_list":
          setAtmList(data);
      }
    }
  }, []);

  const postMessage = (type, data) => {
    const message = JSON.stringify({ type, data });
    ReactNativeWebView.postMessage(message);
  };

  // Marker 생성
  const createMarker = (atm) => {
    const { lat, lon, com_main_num } = atm;

    const image = createMarkerImage(com_main_num);
    const position = new kakao.maps.LatLng(lat, lon);
    const marker = new kakao.maps.Marker({
      image,
      position,
      clickable: true,
    });
    marker.atmInfo = atm

    return marker;
  };

  // Marker 이미지 생성
  const createMarkerImage = (com_main_num) => {
    const size = new kakao.maps.Size(48, 48);
    const options = { offset: new kakao.maps.Point(24, 48) };
    let imgRender;

    switch (com_main_num){
      case 1485 : // SKT
        imgRender = assets.IC_PIN_SK
        break;
      case 923 : // 삼성
        imgRender = assets.IC_PIN_SAMSUNG
        break;
      case 598 : // 이마트
        imgRender = assets.IC_PIN_EMART
        break;
      case 575 : // 홈플러스
        imgRender = assets.IC_PIN_HOMEPLUS
        break;
      case 998 : // 롯데마트
        imgRender = assets.IC_PIN_LOTTE
        break;
      case 4043 : // 하이마트
        imgRender = assets.IC_PIN_HIMART
        break;
      case 3978 : // 우체국
        imgRender = assets.IC_PIN_POST
        break;
      default :
        imgRender = assets.IC_PIN_MINTIT
        break;
    }

    return new kakao.maps.MarkerImage(
      imgRender,
      size,
      options
    );
  };


  // **** UseEffect **** //


  // Kakao map
  useEffect(() => {
    const container = document.getElementById("map");
    const { latitude, longitude } = location;
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    setMap(new kakao.maps.Map(container, options));

    if (ReactNativeWebView) {
      document.addEventListener("message", handleNativeEvent);
      window.addEventListener("message", handleNativeEvent);
    }

    return () => {
      document.removeEventListener("message", handleNativeEvent);
      window.removeEventListener("message", handleNativeEvent);
    };
  }, []);

  // Kakao map update
  useEffect(() => {
    if (map && !!event) {
      switch (event) {
        case "fetch_atm_list":
          const markers = atmList.map((atm) => createMarker(atm));
          markers.map((marker) => {
            marker.setMap(map);
            kakao.maps.event.addListener(marker, "click", () => {
              postMessage("click_marker", marker.atmInfo);
              const msg = Object.keys(marker);
              setMessage(`${msg}`);
            });
            postMessage("edsfsdfsdfsdfsd")
          })
      }
    }
  }, [map, event]);

  // Map eventListener
  useEffect(() => {
    if (map) {
      kakao.maps.event.addListener(map, "click", () => {
        postMessage("click_map");
      });
    }
  }, [map])


  // **** Render **** //


  return (
    <div className="App" >
      <div
        id="map"
        style={{
          width: "100vmax",
          height: "100vmax",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          left: "50%",
          top: "10%",
          background: "white",
          padding: 15,
          transform: "translateX(-50%)",
        }}
      >
        <p>{message}</p>
        <p>{event}</p>
      </div>
    </div>
  );
}

export default App;
