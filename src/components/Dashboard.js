import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  EventNote,
  CalendarMonth,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import LeaveRequest from "./LeaveRequest";
import LeaveQuery from "./LeaveQuery";

const drawerWidth = 240;

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("leaveRequest");
  const { user, logout } = useAuth();

  const handleLeaveClick = () => {
    setLeaveOpen(!leaveOpen);
  };

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "leaveRequest":
        return <LeaveRequest />;
      case "leaveQuery":
        return <LeaveQuery />;
      default:
        return <Typography>歡迎使用系統</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.姓名} - {user?.職稱}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <List>
          {/* 請假系統 */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLeaveClick}>
              <ListItemIcon>
                <EventNote />
              </ListItemIcon>
              <ListItemText primary="請假系統" />
              {leaveOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={leaveOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleMenuItemClick("leaveRequest")}
                selected={currentPage === "leaveRequest"}
              >
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="進行請假" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleMenuItemClick("leaveQuery")}
                selected={currentPage === "leaveQuery"}
              >
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="查詢請假" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
