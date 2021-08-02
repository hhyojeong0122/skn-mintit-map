import assets from "../constants/assets";
const { kakao } = window;

// Marker 이미지 생성
export const createMarkerImage = (com_main_num, isActive = false) => {
  let imgRender;
  let size;
  let options;

  if (!isActive) {
    size = new kakao.maps.Size(28, 28);
    options = { offset: new kakao.maps.Point(14, 14) };

    switch (com_main_num){
      case 1485 : // SKT
        imgRender = assets.IC_PIN_SK_INACTIVE
        break;
      case 923 : // 삼성
        imgRender = assets.IC_PIN_SAMSUNG_INACTIVE
        break;
      case 598 : // 이마트
        imgRender = assets.IC_PIN_EMART_INACTIVE
        break;
      case 575 : // 홈플러스
        imgRender = assets.IC_PIN_HOMEPLUS_INACTIVE
        break;
      case 998 : // 롯데마트
        imgRender = assets.IC_PIN_LOTTE_INACTIVE
        break;
      case 4043 : // 하이마트
        imgRender = assets.IC_PIN_HIMART_INACTIVE
        break;
      case 3978 : // 우체국
        imgRender = assets.IC_PIN_POST_INACTIVE
        break;
      default :
        imgRender = assets.IC_PIN_MINTIT_INACTIVE
        break;
    }
  }

  if (isActive) {
    size = new kakao.maps.Size(40, 40);
    options = { offset: new kakao.maps.Point(20, 20) };

    switch (com_main_num){
      case 1485 :
        imgRender = assets.IC_PIN_SK
        break;
      case 923 :
        imgRender = assets.IC_PIN_SAMSUNG
        break;
      case 598 :
        imgRender = assets.IC_PIN_EMART
        break;
      case 575 :
        imgRender = assets.IC_PIN_HOMEPLUS
        break;
      case 998 :
        imgRender = assets.IC_PIN_LOTTE
        break;
      case 4043 :
        imgRender = assets.IC_PIN_HIMART
        break;
      case 3978 :
        imgRender = assets.IC_PIN_POST
        break;
      default :
        imgRender = assets.IC_PIN_MINTIT
        break;
    }
  }

  return new kakao.maps.MarkerImage(
    imgRender,
    size,
    options
  );
};
