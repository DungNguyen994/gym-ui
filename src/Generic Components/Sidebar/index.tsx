import { useLazyQuery } from "@apollo/client";
import {
  Add,
  Category,
  History,
  Home,
  Inventory,
  Logout,
  Payment,
  Search,
  Settings,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setUser } from "../../Redux-toolkit/features/Auth/authSlice";
import { useAppDispatch } from "../../Redux-toolkit/hooks";
import { LOG_OUT } from "../../graphql/queries/logout";
import { ROUTES } from "../../routes";
import LoadingSpinner from "../LoadingSpinner";
import { MenuItem } from "./MenuItem";
import "./index.scss";
import { client } from "../../config/publicClient";

interface Props {
  isMobile?: boolean;
  closeSidebar?: () => void;
}

export default function Sidebar({ isMobile, closeSidebar }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [logout, { data, loading }] = useLazyQuery(LOG_OUT, { client });
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  if (data?.logout?.data) {
    dispatch(setUser(undefined));
    navigate("/login", { replace: true });
  }

  const onMenuClick = (path: string) => {
    navigate(path);
    setSelected(path);
    if (closeSidebar) closeSidebar();
  };

  return (
    <Box
      className={isMobile ? "mobile-sidebar" : "sidebar"}
      sx={{ display: isMobile ? {} : { xs: "none", md: "block" } }}
      width={{ md: "20%", xl: "10%" }}
    >
      {loading && <LoadingSpinner />}
      <Stack
        sx={{
          justifyContent: "space-between",
          height: "90%",
        }}
      >
        <List style={{ paddingTop: 0 }}>
          <MenuItem
            Icon={Home}
            text="Home"
            onClick={() => onMenuClick(ROUTES.HOME)}
            selected={selected === ROUTES.HOME}
          />
          <MenuItem
            Icon={Add}
            text="Add Member"
            onClick={() => onMenuClick(ROUTES.ADDMEMBER)}
            selected={selected === ROUTES.ADDMEMBER}
          />
          <MenuItem
            Icon={Search}
            text="Find Member"
            onClick={() => onMenuClick(ROUTES.FINDMEMBER)}
            selected={
              selected === ROUTES.FINDMEMBER ||
              selected === ROUTES.EDITMEMBER.replace(":id", id || "")
            }
          />
          <MenuItem
            Icon={ShoppingCart}
            text="POS"
            onClick={() => onMenuClick(ROUTES.POS)}
            selected={selected === ROUTES.POS}
          />
          <MenuItem
            Icon={Inventory}
            text="Inventory"
            onClick={() => onMenuClick(ROUTES.INVENTORY)}
            selected={selected === ROUTES.INVENTORY}
          />
          <MenuItem
            Icon={Category}
            text="Products"
            onClick={() => onMenuClick(ROUTES.PRODUCTS)}
            selected={
              selected === ROUTES.PRODUCTS ||
              selected === ROUTES.NEWPRODUCT ||
              selected === ROUTES.EDITPRODUCT.replace(":id", id || "")
            }
          />
          <MenuItem
            Icon={History}
            text="Visit History"
            onClick={() => onMenuClick(ROUTES.VISIT)}
            selected={selected === ROUTES.VISIT}
          />
          <MenuItem
            Icon={Payment}
            text="Payments"
            onClick={() => onMenuClick(ROUTES.PAYMENTS)}
            selected={selected === ROUTES.PAYMENTS}
          />
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <MenuItem
              Icon={Settings}
              text="Settings"
              onClick={() => onMenuClick(ROUTES.SETTINGS)}
              selected={selected === ROUTES.SETTINGS}
            />
          </Box>
        </List>
        <ListItem className="menu-item-container logout">
          <ListItemButton
            onClick={() => {
              logout();
              client.resetStore();
            }}
            style={{ background: "transparent" }}
          >
            <ListItemIcon>
              <Logout className="icon" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Stack>
    </Box>
  );
}
