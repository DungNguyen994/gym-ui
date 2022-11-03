import { ApolloProvider } from "@apollo/client";
import { Route, Routes } from "react-router-dom";
import Login from "./Authentication/Login";
import PersitLogin from "./Authentication/PersistLogin";
import Register from "./Authentication/Register";
import RequiredAuth from "./Authentication/RequiredAuth";
import Layout from "./Generic Components/Layout";
import { usePrivateClient } from "./hooks/usePrivateClient";
import Home from "./Pages/Home";
import Member from "./Pages/Members";
import AddNew from "./Pages/Members/AddNew";

export default function App() {
  const client = usePrivateClient();
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
              <Route path="/" element={<Home />} />
              <Route path="/members" element={<Member />} />
              <Route path="/members/new" element={<AddNew />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </ApolloProvider>
  );
}
