import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
} from "@mui/material";
import { DatePicker, TimePicker, DateCalendar } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const LEAVE_TYPES = ["特休", "病假", "事假"];

const LeaveRequest = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    leaveType: "特休",
    leaveStartDate: null,
    leaveEndDate: null,
    leaveStartTime: null,
    leaveEndTime: null,
    leaveReason: "",
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const defaultStartTime = parse(
      user?.上班時間 || "09:00",
      "HH:mm",
      new Date()
    );
    const defaultEndTime = parse(
      user?.下班時間 || "18:00",
      "HH:mm",
      new Date()
    );

    setFormData({
      ...formData,
      leaveStartDate: date,
      leaveEndDate: date,
      leaveStartTime: defaultStartTime,
      leaveEndTime: defaultEndTime,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");

      const requestData = {
        username: user?.帳號,
        workStart: user?.上班時間,
        workEnd: user?.下班時間,
        leaveStartDate: format(formData.leaveStartDate, "yyyy-MM-dd"),
        leaveEndDate: format(formData.leaveEndDate, "yyyy-MM-dd"),
        leaveStartTime: format(formData.leaveStartTime, "HH:mm"),
        leaveEndTime: format(formData.leaveEndTime, "HH:mm"),
        leaveType: formData.leaveType,
        leaveReason: formData.leaveReason,
        remainHours: user?.特休時數 - user?.已請特休時數,
      };

      // 调用第一个 API
      const response1 = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook/52959234-01e5-47e4-8855-bc1bffffb6b8",
        requestData
      );

      if (response1.data[0]?.status === "success") {
        const firstApiData = response1.data[0].data;
        // 调用第二个 API，添加 days 和 totalHours
        const response2 = await axios.post(
          "https://cloud.servtech.com.tw:35678/webhook/75ab3495-6769-41c4-a50c-68502ceaa3d5",
          {
            ...requestData,
            ...firstApiData,
            days: firstApiData.days,
            totalHours: firstApiData.totalHours,
          }
        );

        if (response2.data.status === "success") {
          setSuccess("請假申請成功！");
          setOpenDialog(false);
        } else {
          setError("請假申請失敗：" + response2.data.message);
        }
      } else {
        setError("請假檢查失敗：" + (response1.data[0]?.message || "未知錯誤"));
      }
    } catch (error) {
      setError(
        "請假檢查失敗：" + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            請假申請
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            <DateCalendar
              value={selectedDate}
              onChange={handleDateSelect}
              sx={{
                width: "100%",
                "& .MuiPickersCalendarHeader-root": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                "& .MuiPickersDay-root": {
                  margin: "2px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                },
              }}
            />
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  請假資訊
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  剩餘特休時數：{user?.特休時數 - user?.已請特休時數} 小時
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  工作時間：{user?.上班時間} - {user?.下班時間}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>請假申請表</DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <TextField
                select
                label="請假類型"
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                fullWidth
                sx={{ mb: 2, mt: 2 }}
              >
                {LEAVE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <DatePicker
                label="開始日期"
                value={formData.leaveStartDate}
                onChange={(date) =>
                  setFormData({ ...formData, leaveStartDate: date })
                }
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
              />

              <TimePicker
                label="開始時間"
                value={formData.leaveStartTime}
                onChange={(time) =>
                  setFormData({ ...formData, leaveStartTime: time })
                }
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
              />

              <DatePicker
                label="結束日期"
                value={formData.leaveEndDate}
                onChange={(date) =>
                  setFormData({ ...formData, leaveEndDate: date })
                }
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
              />

              <TimePicker
                label="結束時間"
                value={formData.leaveEndTime}
                onChange={(time) =>
                  setFormData({ ...formData, leaveEndTime: time })
                }
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
              />

              <TextField
                label="請假事由"
                multiline
                rows={4}
                value={formData.leaveReason}
                onChange={(e) =>
                  setFormData({ ...formData, leaveReason: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>取消</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                送出
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveRequest;
