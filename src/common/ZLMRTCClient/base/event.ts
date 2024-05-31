/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-06 17:52:27
 * @LastEditTime: 2022-08-06 21:45:09
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\common\ZLMRTCClient\base\event.ts
 */
const Events = {
  WEBRTC_NOT_SUPPORT: 'WEBRTC_NOT_SUPPORT',
  WEBRTC_ICE_CANDIDATE_ERROR: 'WEBRTC_ICE_CANDIDATE_ERROR',
  WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED: 'WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED',
  WEBRTC_ON_REMOTE_STREAMS: 'WEBRTC_ON_REMOTE_STREAMS',
  WEBRTC_ON_LOCAL_STREAM: 'WEBRTC_ON_LOCAL_STREAM',
  WEBRTC_ON_CONNECTION_STATE_CHANGE: 'WEBRTC_ON_CONNECTION_STATE_CHANGE',
  WEBRTC_ON_DATA_CHANNEL_OPEN: 'WEBRTC_ON_DATA_CHANNEL_OPEN',
  WEBRTC_ON_DATA_CHANNEL_CLOSE: 'WEBRTC_ON_DATA_CHANNEL_CLOSE',
  WEBRTC_ON_DATA_CHANNEL_ERR: 'WEBRTC_ON_DATA_CHANNEL_ERR',
  WEBRTC_ON_DATA_CHANNEL_MSG: 'WEBRTC_ON_DATA_CHANNEL_MSG',
  CAPTURE_STREAM_FAILED: 'CAPTURE_STREAM_FAILED'
}

export default Events
