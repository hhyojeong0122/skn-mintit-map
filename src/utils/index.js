import assets from "../constants/assets";

const { kakao } = window;

export const postMessage = (type, data) => {
  if (!!window.ReactNativeWebView) {
    const message = JSON.stringify({
      type: type,
      data: data,
    });
    window.ReactNativeWebView.postMessage(message);
  }
};

// Marker 이미지 생성
export const createMarkerImage = (com_main_num, sts, isActive = false) => {
  let imgRender;
  let size;
  let options;

  if (!isActive) {
    size = new kakao.maps.Size(28, 28);
    options = { offset: new kakao.maps.Point(14, 14) };

    // "1": 비장애, "2": 장애
    if (sts === "2") {
      switch (com_main_num) {
        case 1485: // SKT
          imgRender = assets.IC_PIN_SK_INACTIVE_GRAY;
          break;
        case 923: // 삼성
          imgRender = assets.IC_PIN_SAMSUNG_INACTIVE_GRAY;
          break;
        case 598: // 이마트
          imgRender = assets.IC_PIN_EMART_INACTIVE_GRAY;
          break;
        case 575: // 홈플러스
          imgRender = assets.IC_PIN_HOMEPLUS_INACTIVE_GRAY;
          break;
        case 998: // 롯데마트
          imgRender = assets.IC_PIN_LOTTE_INACTIVE_GRAY;
          break;
        case 4043: // 하이마트
          imgRender = assets.IC_PIN_HIMART_INACTIVE_GRAY;
          break;
        case 3978: // 우체국
          imgRender = assets.IC_PIN_POST_INACTIVE_GRAY;
          break;
        case 4480: // LG U+
          imgRender = assets.IC_PIN_UPLUS_INACTIVE_GRAY;
          break;
        case 4573: // KT
          imgRender = assets.IC_PIN_KT_INACTIVE_GRAY;
          break;
        default:
          imgRender = assets.IC_PIN_MINTIT_INACTIVE_GRAY;
          break;
      }
    } else {
      switch (com_main_num) {
        case 1485:
          imgRender = assets.IC_PIN_SK_INACTIVE;
          break;
        case 923:
          imgRender = assets.IC_PIN_SAMSUNG_INACTIVE;
          break;
        case 598:
          imgRender = assets.IC_PIN_EMART_INACTIVE;
          break;
        case 575:
          imgRender = assets.IC_PIN_HOMEPLUS_INACTIVE;
          break;
        case 998:
          imgRender = assets.IC_PIN_LOTTE_INACTIVE;
          break;
        case 4043:
          imgRender = assets.IC_PIN_HIMART_INACTIVE;
          break;
        case 3978:
          imgRender = assets.IC_PIN_POST_INACTIVE;
          break;
        case 4480:
          imgRender = assets.IC_PIN_UPLUS_INACTIVE;
          break;
        case 4573:
          imgRender = assets.IC_PIN_KT_INACTIVE;
          break;
        default:
          imgRender = assets.IC_PIN_MINTIT_INACTIVE;
          break;
      }
    }
  }

  if (isActive) {
    size = new kakao.maps.Size(48, 48);
    options = { offset: new kakao.maps.Point(24, 48) };

    if (sts === "2") {
      switch (com_main_num) {
        case 1485:
          imgRender = assets.IC_PIN_SK_GRAY;
          break;
        case 923:
          imgRender = assets.IC_PIN_SAMSUNG_GRAY;
          break;
        case 598:
          imgRender = assets.IC_PIN_EMART_GRAY;
          break;
        case 575:
          imgRender = assets.IC_PIN_HOMEPLUS_GRAY;
          break;
        case 998:
          imgRender = assets.IC_PIN_LOTTE_GRAY;
          break;
        case 4043:
          imgRender = assets.IC_PIN_HIMART_GRAY;
          break;
        case 3978:
          imgRender = assets.IC_PIN_POST_GRAY;
          break;
        case 4480:
          imgRender = assets.IC_PIN_UPLUS_GRAY;
          break;
        case 4573:
          imgRender = assets.IC_PIN_KT_GRAY;
          break;
        default:
          imgRender = assets.IC_PIN_MINTIT_GRAY;
          break;
      }
    } else {
      switch (com_main_num) {
        case 1485:
          imgRender = assets.IC_PIN_SK;
          break;
        case 923:
          imgRender = assets.IC_PIN_SAMSUNG;
          break;
        case 598:
          imgRender = assets.IC_PIN_EMART;
          break;
        case 575:
          imgRender = assets.IC_PIN_HOMEPLUS;
          break;
        case 998:
          imgRender = assets.IC_PIN_LOTTE;
          break;
        case 4043:
          imgRender = assets.IC_PIN_HIMART;
          break;
        case 3978:
          imgRender = assets.IC_PIN_POST;
          break;
        case 4480:
          imgRender = assets.IC_PIN_UPLUS;
          break;
        case 4573:
          imgRender = assets.IC_PIN_KT;
          break;
        default:
          imgRender = assets.IC_PIN_MINTIT;
          break;
      }
    }
  }

  return new kakao.maps.MarkerImage(imgRender, size, options);
};

//Marker 생성
export const createMarker = (atm) => {
  const { lat, lon, com_main_num, sts } = atm;

  const image = createMarkerImage(com_main_num, sts);
  const position = new kakao.maps.LatLng(lat, lon);
  const marker = new kakao.maps.Marker({
    image,
    position,
    clickable: true,
    zIndex: 1
  });
  marker.normalImage = image;
  marker.atmInfo = atm;

  return marker;
};
