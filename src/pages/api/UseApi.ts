import axios from "axios";
import { decryptData } from "@/components/common/EncryptionDecryption";
import { Base_Url } from "@/config/BaseUrl";

////////////////////*****************All Api is Called Here Except UseManagement Page And Sigin And Forgot Password************************************** */

// Generic API Request Function
// - Omits the Authorization header when there is no token (public
//   endpoints such as panel-login / panel-send-password must not send
//   an empty `Bearer ` value - some backends reject it and login fails
//   even though the credentials are correct).
// - Does not force `Content-Type: application/json` for FormData payloads,
//   so the browser/axios can set the multipart boundary automatically.
// - Never swallows server responses: HTTP error responses (4xx/5xx with a
//   JSON body) are returned as-is so call sites can read
//   `response.data.code / response.data.msg`. Only true network failures
//   (no response received) fall back to a generic shape.
const apiRequest = async (
  method: string,
  endpoint: string,
  data: any = null
): Promise<any> => {
  try {
    const token_encryption: string | null = localStorage.getItem("token");
    const token: string = decryptData(token_encryption);
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const isFormData: boolean =
      typeof FormData !== "undefined" && data instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const config: Record<string, any> = {
      method,
      url: `${Base_Url}${endpoint}`,
      headers,
    };

    if (data) {
      config.data = data;
    }

    const response: any = await axios(config);
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    console.error(`Error in ${method} request to ${endpoint}`, error);
    return {
      status: 0,
      data: { code: 500, msg: "Network error. Please try again." },
    };
  }
};
export const FETCH_DASHBOARD_DATA = (dateyear: string | any): Promise<any> =>
  apiRequest("GET", `/panel-fetch-dashboard-data/${dateyear}`);
export const FETCH_PROFILE_DATA = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-profile`);
export const UPDATE_PROFILE = (data: any): Promise<any> =>
  apiRequest("POST", `/panel-update-profile`, data);
export const CHNAGE_PASSWORD = (data: any): Promise<any> =>
  apiRequest("POST", `/panel-change-password`, data);
export const PANEL_LOGIN = (data: any): Promise<any> =>
  apiRequest("POST", `/panel-login`, data);
export const FORGOT_PASSWORD = (
  username: string | any,
  email: string | any
): Promise<any> =>
  apiRequest("POST", `panel-send-password?username=${username}&email=${email}`);
// ------------------MASTER------------------------
//CATEGORY LIST
export const CATEGORY_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-category-list`);
// CREATE CATEGORY
export const CREATE_CATEGORY = (data: any): Promise<any> =>
  apiRequest("POST", "/panel-create-category", data);
//FETCH CATEGORY
export const FETCH_CATEGORY_BY_ID = (decryptedId: string | any): Promise<any> =>
  apiRequest("GET", `/panel-fetch-category-by-id/${decryptedId}`);
// UPDATE CATEGORY
export const UPDATE_CATEGORY = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest(
    "POST",
    `/panel-update-category/${decryptedId}?_method=PUT`,
    formData
  );

//SUB CATEGORY LIST
export const SUB_CATEGORY_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-sub-category-list`);
//SUB FETCH CATEGORY
export const SUB_FETCH_CATEGORY = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-category`);
// CREATE SUB  CATEGORY
export const CREATE_SUB_CATEGORY = (data: any): Promise<any> =>
  apiRequest("POST", "/panel-create-sub-category", data);
// FETCH SUB  CATEGORY
export const FETCH_SUB_CATEGORY_BY_ID = (
  decryptedId: string | any
): Promise<any> =>
  apiRequest("GET", `/panel-fetch-sub-category-by-id/${decryptedId}`);
// UPDATE CATEGORY
export const UPDATE_SUB_CATEGORY = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest(
    "POST",
    `/panel-update-sub-category/${decryptedId}?_method=PUT`,
    formData
  );

//VENDOR LIST
export const VENDOR_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-list`);
// FETCH SUB  VENDOR
export const FETCH_SUB_CATEGORY = (data: any): Promise<any> =>
  apiRequest("GET", `/panel-fetch-sub-category/${data}`);
// CREATE SUB  VENDOR
export const CREATE_VENDOR = (data: any): Promise<any> =>
  apiRequest("POST", "/panel-create-vendor", data);
// FETCH SUB  VENDOR
export const FETCH_SUB_VENDOR_BY_ID = (
  decryptedId: string | any
): Promise<any> => apiRequest("GET", `/panel-fetch-vendor-by-id/${decryptedId}`);
// UPDATE SUB  VENDOR
export const UPDATE_VENDOR = (
  decryptedId: string | any,
  data: any
): Promise<any> => apiRequest("PUT", `/panel-update-vendor/${decryptedId}`, data);
//VENDOR USER LIST
export const VENDOR_USER_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-user-list`);
//CREATE VENDOR USER LIST
export const CREATE_VENDOR_USER_LIST = (data: any): Promise<any> =>
  apiRequest("POST", `/panel-create-vendor-user`, data);
// FETCH VENDOR_USER
export const FETCH_VENDOR_USER_BY_ID = (
  decryptedId: string | any
): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-user-by-id/${decryptedId}`);

// UPDATE VENDOR_USER
export const UPDATE_VENDOR_USER = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest(
    "POST",
    `/panel-update-vendor-user/${decryptedId}?_method=PUT`,
    formData
  );
// VENDORS LIVE LIST
export const VENDOR_LIVE_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-live-list`);
// FETCH VENDOR_LIVE
export const VENDOR_LIVE_LIST_BY_ID = (
  decryptedId: string | any
): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-live-by-id/${decryptedId}`);
// UPDATE VENDOR_LIVE
export const UPDATE_VENDOR_LIVE = (
  decryptedId: string | any,
  data: any
): Promise<any> =>
  apiRequest("PUT", `/panel-update-vendor-live/${decryptedId}`, data);
// VENDORS SPOT_RATES
export const VENDOR_SPOT_RATES_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor-spot-rates-list`);
// FETCH VENDOR_SPOT_RATES
export const VENDOR_SPOT_RATES_LIST_BY_ID = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-vendor/3`);
// CREATE VENDOR_RATES
export const CREATE_VENDOR_SPOT_RATES = (formData: any): Promise<any> =>
  apiRequest("POST", `/panel-create-vendor-spot-rates`, formData);
// VENDORS NEWS
export const VENDOR_NEWS_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-news-list`);
// CREATE VENDOR_NEWS
export const CREATE_VENDOR_NEWS = (formData: any): Promise<any> =>
  apiRequest("POST", `/panel-create-news`, formData);
// FETCH VENDOR_NEWS
export const VENDOR_NEWS_LIST_BY_ID = (
  decryptedId: string | any
): Promise<any> => apiRequest("GET", `/panel-fetch-news-by-id/${decryptedId}`);
// UPDATE_VENDOR_NEWS
export const UPDATE_VENDOR_NEWS = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest("POST", `/panel-update-news/${decryptedId}?_method=PUT`, formData);
// VENDORS SLIDER
export const VENDOR_SLIDER_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-slider-list`);

// CREATE VENDOR_SLIDER
export const CREATE_VENDOR_SLIDER = (formData: any): Promise<any> =>
  apiRequest("POST", `/panel-create-slider`, formData);
// FETCH VENDOR_SLIDER
export const VENDOR_SLIDER_LIST_BY_ID = (
  decryptedId: string | any
): Promise<any> =>
  apiRequest("GET", `/panel-fetch-slider-by-id/${decryptedId}`);
// UPDATE_VENDOR_SLIDER
export const UPDATE_VENDOR_SLIDER = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest(
    "POST",
    `/panel-update-slider/${decryptedId}?_method=PUT`,
    formData
  );
// NOTIFICATION LIST
export const NOTIFICATION_LIST = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-notification-list`);
// CREATE NOTIFICATION LIST
export const CREATE_NOTIFICATION_LIST = (formData: any): Promise<any> =>
  apiRequest("POST", `/panel-create-notification`, formData);
// FETCH NOTIFICATION
export const VENDOR_NOTIFICATION_BY_ID = (
  decryptedId: string | any
): Promise<any> =>
  apiRequest("GET", `/panel-fetch-notification-by-id/${decryptedId}`);
export const UPDATE_NOTIFICATION = (
  decryptedId: string | any,
  formData: any
): Promise<any> =>
  apiRequest(
    "POST",
    `/panel-update-notification/${decryptedId}?_method=PUT`,
    formData
  );

// WEBSITE ENQUIRY LIST
export const WEBSITE_ENQUIRY = (): Promise<any> =>
  apiRequest("GET", `/panel-fetch-contact-list`);
