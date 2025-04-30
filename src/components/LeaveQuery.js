import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Grid, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { DataGrid } from "@mui/x-data-grid";

const LeaveQuery = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaveRecords, setLeaveRecords] = useState([]);

  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const columns = [
    { field: "單號", headerName: "單號", width: 180 },
    { field: "假別", headerName: "假別", width: 100 },
    { field: "起始日期", headerName: "請假日期", width: 120 },
    { field: "起始時間", headerName: "開始時間", width: 100 },
    { field: "結束時間", headerName: "結束時間", width: 100 },
    { field: "事由", headerName: "請假事由", width: 200 },
    { field: "時數", headerName: "時數", width: 80 },
    { field: "狀態", headerName: "狀態", width: 100 },
    {
      field: "建立時間",
      headerName: "建立時間",
      width: 180,
      valueFormatter: (params) => {
        return format(new Date(params.value), "yyyy-MM-dd HH:mm:ss");
      },
    },
    {
      field: "actions",
      headerName: "操作",
      width: 100,
      renderCell: (params) => {
        if (params.row.狀態 === "已取消") return null;
        return (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleCancel(params.row)}
          >
            取消
          </Button>
        );
      },
    },
  ];

  const handleQuery = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      console.log("查询参数:", {
        username: user?.帳號,
        startdate: format(dateRange.startDate, "yyyy-MM-dd"),
        enddate: format(dateRange.endDate, "yyyy-MM-dd"),
      });

      const response = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook/dd202272-d668-4b3e-ad9a-ad21c6c49be2",
        {
          username: user?.帳號,
          startdate: format(dateRange.startDate, "yyyy-MM-dd"),
          enddate: format(dateRange.endDate, "yyyy-MM-dd"),
        }
      );

      console.log("API 响应:", response.data);

      if (response.data) {
        // 确保数据是数组
        const records = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setLeaveRecords(records);
      } else {
        setLeaveRecords([]);
        setError("未获取到数据");
      }
    } catch (error) {
      console.error("查询错误:", error);
      setError("查詢失敗：" + (error.response?.data?.message || error.message));
      setLeaveRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (record) => {
    try {
      setError("");
      setSuccess("");

      const response = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook/75ab3495-6769-41c4-a50c-68502ceaa3d5",
        {
          ...record,
          狀態: "已取消",
        }
      );

      if (response.data.status === "success") {
        setSuccess("取消請假成功！");
        handleQuery(); // 重新查詢列表
      } else {
        setError("取消請假失敗：" + response.data.message);
      }
    } catch (error) {
      setError(
        "取消請假失敗：" + (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    handleQuery();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            請假查詢
          </Typography>

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

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="開始日期"
                value={dateRange.startDate}
                onChange={(date) =>
                  setDateRange({ ...dateRange, startDate: date })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="結束日期"
                value={dateRange.endDate}
                onChange={(date) =>
                  setDateRange({ ...dateRange, endDate: date })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={handleQuery}
                fullWidth
                sx={{ height: "56px" }}
                disabled={loading}
              >
                查詢
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={leaveRecords}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              loading={loading}
              getRowId={(row) => row.單號 || Math.random()}
            />
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveQuery;
