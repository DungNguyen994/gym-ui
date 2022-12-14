import { ApolloProvider } from "@apollo/client";
import { Route, Routes } from "react-router-dom";
import Login from "./Authentication/Login";
import PersitLogin from "./Authentication/PersistLogin";
import Register from "./Authentication/Register";
import RequiredAuth from "./Authentication/RequiredAuth";
import Layout from "./Generic Components/Layout";
import Inventory from "./Pages/Inventory";
import FindMember from "./Pages/Members/FindMember";
import MemberDetails from "./Pages/Members/MemberDetails";
import POS from "./Pages/POS";
import Products from "./Pages/Products";
import AddNewProduct from "./Pages/Products/AddNewProduct";
import ProductDetails from "./Pages/Products/ProductDetails";
import { usePrivateClient } from "./hooks/usePrivateClient";
import { ROUTES } from "./routes";
import { useEffect } from "react";
import VisitHistoryPage from "./Pages/VisitHistory";
import Payments from "./Pages/Payments";
import Settings from "./Pages/Settings";
import Home from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import ChangePassword from "./Pages/UserProfile/ChangePassword";
import NotFound from "./Pages/NotFound";
import AddNewMember from "./Pages/Members/AddNewMember";

export default function App() {
  const client = usePrivateClient();
  //clear store cache everyday
  useEffect(() => {
    const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
    const interval = setInterval(async () => {
      client.resetStore();
      console.log("Cache is Clear!");
    }, DAY_IN_MILISECONDS);

    return () => clearInterval(interval);
  }, [client]);
  return (
    <ApolloProvider client={client}>
      <Routes>
        {/*public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*protected routes */}
        <Route element={<PersitLogin />}>
          <Route element={<RequiredAuth />}>
            <Route path="/" element={<Layout />}>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.FINDMEMBER} element={<FindMember />} />
              <Route path={ROUTES.ADDMEMBER} element={<AddNewMember />} />
              <Route path={ROUTES.EDITMEMBER} element={<MemberDetails />} />
              <Route path={ROUTES.POS} element={<POS />} />
              <Route path={ROUTES.INVENTORY} element={<Inventory />} />
              <Route path={ROUTES.PRODUCTS} element={<Products />} />
              <Route path={ROUTES.NEWPRODUCT} element={<AddNewProduct />} />
              <Route path={ROUTES.EDITPRODUCT} element={<ProductDetails />} />
              <Route path={ROUTES.VISIT} element={<VisitHistoryPage />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path={ROUTES.PAYMENTS} element={<Payments />} />
              <Route path={ROUTES.USERPROFILE} element={<UserProfile />} />
              <Route
                path={ROUTES.UPDATEPASSW0RD}
                element={<ChangePassword />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ApolloProvider>
  );
}
