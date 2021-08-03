import React, { useState } from "react";
import actions from "../constants/actions";

export default function useNativeEvent (nativeEvent) {
  const [event, setEvent] = useState()
  const { type, data } = JSON.parse(nativeEvent.data);

  setEvent({ type: type, data: data });

  if (type === actions.FETCH_ATM_LIST) {
    postMessage(type);
    return;
  }

  postMessage(type, data);

  return {
    event
  };
};