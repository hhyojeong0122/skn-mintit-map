import React, { useCallback, useEffect, useState, useRef } from "react";
import { get } from "lodash";
import useDebounce from "../hooks/useDebounce";
import { createMarkerImage, createMarker } from "../utils"
import assets from "../constants/assets";
import actions from "../constants/actions";

const { kakao } = window;

export default function AtmMapPage() {
  const [map, setMap] = useState();
  const [event, setEvent] = useState()
  const selectedMarker = useRef();
  const [mapCenter, setMapCenter] = useDebounce();
  const [location, setLocation] = useState({
    latitude: 37.5681138,
    longitude: 126.9805044,
  });
  const [myLocation, setMyLocation] = useState(null);
  const [myLocationMarker, setMyLocationMarker] = useState(null);
  const [atmList, setAtmList] = useState([]);

  const postMessage = (type, data) => {
    if (!!window.ReactNativeWebView) {
      const message = JSON.stringify({ type: type , data: data });
      window.ReactNativeWebView.postMessage(message);
    }
  };

  const handleNativeEvent = (event) => {
    const { type, data } = JSON.parse(event.data);

    setEvent({ type: type, data: data });

    if (type === actions.FETCH_ATM_LIST) {
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

    switch (type) {
      case actions.FETCH_ATM_LIST :
        const data = get(event, "data");
        const markers = data.map((atm) => createMarker(atm));
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel: 8, // 클러스터 할 최소 지도 레벨
          disableClickZoom: true, // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
        });
        setAtmList(markers);
        clusterer.addMarkers(markers);

        markers.map((marker) => {
          marker.setMap(map);

          const activeMarkerImage = createMarkerImage(marker.atmInfo.com_main_num, true);
          kakao.maps.event.addListener(marker, "click", () => {
            const moveLatLng = new kakao.maps.LatLng(marker.atmInfo.lat, marker.atmInfo.lon);

            if (!selectedMarker || selectedMarker?.current !== marker) {
              selectedMarker.current?.setImage(selectedMarker.current.normalImage);
              marker.setImage(activeMarkerImage);
            }
            selectedMarker.current = marker;

            map.panTo(moveLatLng);
            marker.setImage(activeMarkerImage);
            postMessage("click_marker", marker.atmInfo);
          });
        });
        break;

      case actions.GET_DIRECTIONS :
        const latitude = parseFloat(get(event, "data.latitude"), 10);
        const longitude = parseFloat(get(event, "data.longitude"), 10);
        const moveLatLng = new kakao.maps.LatLng(latitude, longitude);

        // 내위치 마커 생성
        if (myLocation === null) {
          const myLocationImgSrc = assets.IC_MY_LOCATION;
          const myLocationImgSize = new kakao.maps.Size(28 * 2.5, 28 * 2.5);
          const myLocationImgOption = { offset: new kakao.maps.Point(14, 14) };
          const myLocationImg = new kakao.maps.MarkerImage(myLocationImgSrc, myLocationImgSize, myLocationImgOption);
          const myLocationMarker = new kakao.maps.Marker({
            position: moveLatLng,
            image: myLocationImg
          });

          myLocationMarker.setMap(map);
          setMyLocationMarker(myLocationMarker);
        }

        // 내위치 마커 세팅
        setMyLocation(latitude, longitude);
        myLocationMarker !== null && myLocationMarker.setPosition(moveLatLng);
        map.setCenter(moveLatLng);
        map.panTo(moveLatLng);
        postMessage("get direction lat", latitude);
        postMessage("get direction lon", longitude);

        // 현재위치 위경도로 주소 가져오기
        const geocoder = new kakao.maps.services.Geocoder();
        // const coord = new kakao.maps.LatLng(myLocation.latitude, myLocation.longitude);
        const addressCallback = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            postMessage(actions.MY_LOCATION_ADDRESS, result[0].address);
          }
        };

        geocoder.coord2Address(moveLatLng.getLng(), moveLatLng.getLat(), addressCallback);
        break;

      case actions.MOVE_TO_ATM_LOCATION:
        const targetId = get(event, "data.atmId");
        const target = atmList.find(({atmInfo: { atm_num }}) => atm_num === targetId);

        kakao.maps.event.trigger(target, "click");
        break;

      default:
        postMessage("not selected type");
        break;
    }
  }, [map, event]);

  useEffect(() => {
    if (map) {
      kakao.maps.event.addListener(map, "click", () => {
        if (selectedMarker?.current) {
          selectedMarker.current?.setImage(
            selectedMarker.current?.normalImage
          );
        }

        postMessage("click_map");
      });
      kakao.maps.event.addListener(map, "center_changed", () => {
        const latlng = map.getCenter();
        setMapCenter({
          latitude: latlng.getLat(),
          longitude: latlng.getLng(),
        });
      });
    }
  }, [map]);

  useEffect(() => {
    if (mapCenter) {
      postMessage("current_map_center", {
        latitude: get(mapCenter, "latitude"),
        longitude: get(mapCenter, "longitude"),
      });
    }
  }, [mapCenter]);


  // **** Render **** //


  return (
    <>
      <div
        id="map"
        style={{
          width: "100vw",
          height: "100vh",
          userSelect: "none"
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
      {/*</div>*/}
    </>
  );
}
