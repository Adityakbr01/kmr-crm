import { Routes, Route } from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";
import Dashboard from "@/pages/home/Dashboard";
import LiveList from "@/pages/appUpdates/live/LiveList";
import SpotList from "@/pages/appUpdates/spot/SpotList";
import AddSpotList from "@/pages/appUpdates/spot/AddSpotList";
import NewsList from "@/pages/appUpdates/news/NewsList";
import AddNewsList from "@/pages/appUpdates/news/AddNewsList";
import EditNewsList from "@/pages/appUpdates/news/EditNewsList";
import RatesList from "@/pages/appUpdates/rates/RatesList";
import AddRatesList from "@/pages/appUpdates/rates/AddRatesList";
import EditRatesList from "@/pages/appUpdates/rates/EditRatesList";
import SubCategory from "@/pages/Master/subCategory.jsx/SubCategory";
import VendorList from "@/pages/Master/Vendor/VendorList";
import VendorUserList from "@/pages/Master/VendorUser/VendorUserList";
import EditLiveList from "@/pages/appUpdates/live/EditLiveList";
import ForgetPassword from "@/pages/auth/ForgetPassword";
import { Toaster } from "sonner";
import AddCategory from "@/pages/Master/category/AddCategory";
import AddSubCategory from "@/pages/Master/subCategory.jsx/AddSubCategory";
import EditSubCategory from "@/pages/Master/subCategory.jsx/EditSubCategory";
import EditVendor from "@/pages/Master/Vendor/EditVendor";
import AddVendor from "@/pages/Master/Vendor/AddVendor";
import EditVednorUser from "@/pages/Master/VendorUser/EditVednorUser";
import AddVendorUser from "@/pages/Master/VendorUser/AddVendorUser";
import Profile from "@/pages/Profile/Profile";
import Notification from "@/pages/Notification/Notification";
import AddNotification from "@/pages/Notification/AddNotification";
import EditNotification from "@/pages/Notification/EditNotification";
import Slider from "@/pages/appUpdates/slider/Slider";
import AddSlider from "@/pages/appUpdates/slider/AddSlider";
import EditSlider from "@/pages/appUpdates/slider/EditSlider";
import WebsiteEnquiry from "@/pages/websiteEnquiry/WebsiteEnquiry";
import EditCategory from "@/pages/Master/category/EditCategory";
import CategoryList from "@/pages/Master/category/CategoryList";
import DisableRightClick from "@/components/common/DisableRightClick";
function App() {
  return (
    <>
      <DisableRightClick />
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* app update -- live  */}
        <Route path="/app-update/live" element={<LiveList />} />
        <Route path="/app-update/live/edit/:id" element={<EditLiveList />} />

        {/* app update--  spot  */}
        <Route path="/app-update/spot" element={<SpotList />} />
        <Route path="/app-update/spot/add" element={<AddSpotList />} />

        {/* app updates -news  */}
        <Route path="/app-update/news" element={<NewsList />} />
        <Route path="/app-update/news/add" element={<AddNewsList />} />
        <Route path="/app-update/news/edit/:id" element={<EditNewsList />} />

        {/* app update -rates  */}
        <Route path="/app-update/rates" element={<RatesList />} />
        <Route path="/app-update/rates/edit/:id" element={<EditRatesList />} />
        <Route path="/app-update/rates/add" element={<AddRatesList />} />
        {/* /app update -slider */}
        <Route path="/app-update/slider" element={<Slider />} />
        <Route path="/app-update/slider/add" element={<AddSlider />} />
        <Route path="/app-update/slider/edit/:id" element={<EditSlider />} />

        {/* master -category  */}

        <Route path="/master/category" element={<CategoryList />} />
        <Route path="/master/category/add" element={<AddCategory />} />
        <Route path="/master/category/edit/:id" element={<EditCategory />} />

        {/* master -sub category */}
        <Route path="/master/subcategory" element={<SubCategory />} />
        <Route path="/master/subcategory/add" element={<AddSubCategory />} />
        <Route
          path="/master/subcategory/edit/:id"
          element={<EditSubCategory />}
        />
        {/* master -vendor  */}
        <Route path="/master/vendor" element={<VendorList />} />
        <Route path="/master/vendor/add" element={<AddVendor />} />
        <Route path="/master/vendor/edit/:id" element={<EditVendor />} />
        {/* master - vendor user  */}
        <Route path="/master/vendor-user" element={<VendorUserList />} />
        <Route path="/master/vendor-user/add" element={<AddVendorUser />} />
        <Route
          path="/master/vendor-user/edit/:id"
          element={<EditVednorUser />}
        />

        {/* //Notification */}
        <Route path="/notification" element={<Notification />} />
        <Route path="/notification/add" element={<AddNotification />} />
        <Route path="/notification/edit/:id" element={<EditNotification />} />
        {/* //WebsiteEnquiry */}
        <Route path="/website-enquiry" element={<WebsiteEnquiry />} />
      </Routes>
    </>
  );
}

export default App;
