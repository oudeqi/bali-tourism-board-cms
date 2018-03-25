/**
 * Created by 49699 on 2018/2/5.
 */
// export const BASE_URL = 'http://47.88.216.48:80/bali/v1/'
export const BASE_URL = 'http://193.112.106.43:80/bali/v1'
export const GOOGLE_BASE_URL = 'http://maps.google.cn/maps/api/geocode/json'
// 国外 https://maps.googleapis.com/maps/api/geocode/json
// 国内 http://maps.google.cn/maps/api/geocode/json
export const GOOGLE_MAP_URL = 'http://www.google.cn/maps/api/js?key=AIzaSyB7B_PqmM800JRQRJFta_Hv4G6U6bWArJg' // &sensor=true&sensor=true&sensor=false&region=cn&language=zh-CN
// 国外 http://maps.google.com/maps/api/js
// 国内 http://www.google.cn/maps/api/js
export const GOOGLE_MAP_INIT_ZOOM = 6
export const GOOGLE_MAP_DEFAULT_LOCATION = {
  lat: 35.780287,
  lng: 104.1361118
}
export const VERSION = 1
export const LOGIN_LIFE_TIME = 30 * 60 * 1000
export const NEW_CROPPER_OPTIONS_VERTICAL = {
  aspectRatio: 1080 / 1920,
  autoCropArea: 0.75,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false
}
export const GET_CROPPED_CANVAS_OPTIONS_VERTICAL = {
  width: 1080,
  minWidth: 1080,
  maxWidth: 8000,
  minHeight: 1920,
  fillColor: '#fff',
  imageSmoothingEnabled: false,
  imageSmoothingQuality: 'high'
}
export const NEW_CROPPER_OPTIONS_HORIZONTAL = {
  aspectRatio: 720 / 350,
  autoCropArea: 0.75,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false
}
export const GET_CROPPED_CANVAS_OPTIONS_HORIZONTAL = {
  width: 720,
  minWidth: 720,
  maxWidth: 4000,
  minHeight: 350,
  fillColor: '#fff',
  imageSmoothingEnabled: false,
  imageSmoothingQuality: 'high'
}
