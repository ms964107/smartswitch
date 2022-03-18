const url_local = "http://localhost"
const url_remote = "http://35.224.217.59"

const port = 3001

const API_URL = url_remote + ":" + port

export const register = API_URL + "/register"
export const login = API_URL + "/login"
export const changePassword = API_URL + "/changePassword"
export const modelList = API_URL + "/models"
export const addVehicle = API_URL + "/add"
export const modifyVehicle = API_URL + "/modify"
export const deleteVehicle = API_URL + "/delete"
export const vehicleList = API_URL + "/vehicles"
export const refreshToken = API_URL + "/token"
export const locationList = API_URL + "/location"
export const config = API_URL + "/config"
export const configInfo = API_URL + "/configInfo"
