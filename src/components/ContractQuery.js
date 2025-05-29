import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfYear, endOfMonth, setDate, parse } from "date-fns";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";

const ContractQuery = () => {
  // 获取当前日期
  const today = new Date();
  // 设置起始日期为当年1月1日
  const defaultStartDate = startOfYear(today);
  // 设置结束日期为当月最后一天
  const defaultEndDate = endOfMonth(today);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  // 添加日期格式处理函数
  const formatDateString = (dateStr) => {
    if (!dateStr) return null;

    // 移除所有空格
    dateStr = dateStr.trim();

    // 如果已经是标准格式（包含 - 或 /），直接返回
    if (dateStr.includes("-") || dateStr.includes("/")) {
      // 统一转换为 / 格式
      return dateStr.replace(/-/g, "/");
    }

    // 处理纯数字格式
    // 移除所有非数字字符
    const numbersOnly = dateStr.replace(/\D/g, "");

    console.log(numbersOnly);

    // 根据长度处理不同格式
    if (numbersOnly.length === 8) {
      // YYYYMMDD 格式
      return `${numbersOnly.slice(0, 4)}/${numbersOnly.slice(4, 6)}/${numbersOnly.slice(6, 8)}`;
    } else if (numbersOnly.length === 7) {
      // 处理 YYYYMDD 格式（如：2024315）
      const year = numbersOnly.slice(0, 4);
      const month = numbersOnly.slice(4, 5);
      const day = numbersOnly.slice(5, 7);
      return `${year}/0${month}/${day}`;
    } else if (numbersOnly.length === 6) {
      // 处理 YYYYMD 格式（如：202431）
      const year = numbersOnly.slice(0, 4);
      const month = numbersOnly.slice(4, 5);
      const day = numbersOnly.slice(5, 6);
      return `${year}/0${month}/0${day}`;
    }

    console.warn("無法識別的日期格式:", dateStr);
    return null;
  };

  const handleQuery = async () => {
    if (!startDate || !endDate) {
      setError("請選擇起始日期和結束日期");
      return;
    }

    try {
      const response = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook/1a02ada6-cca4-4146-a527-7f47a7e09a31",
        {
          startDate: format(startDate, "yyyy/MM/dd"),
          endDate: format(endDate, "yyyy/MM/dd"),
        }
      );

      console.log(response);
      if (response.data) {
        // 过滤数据，处理日期格式后再比较
        const filteredContracts = response.data.filter((contract) => {
          const formattedDate = formatDateString(contract.data.申請日期);
          if (!formattedDate) {
            console.warn("無效的申請日期:", contract.data.申請日期);
            return false;
          }

          try {
            const applyDate = parse(formattedDate, "yyyy/MM/dd", new Date());
            return applyDate >= startDate && applyDate <= endDate;
          } catch (err) {
            console.error("日期解析錯誤:", formattedDate, err);
            return false;
          }
        });

        setContracts(filteredContracts);
        setError("");
      }
    } catch (err) {
      setError("查詢失敗，請稍後重試");
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setOpenDialog(true);
  };

  const getContractStatus = (contract) => {
    return contract.合約編號 ? "已成立" : "申請中";
  };

  const getContractYear = (contract) => {
    if (!contract.合約編號) return "";
    const match = contract.合約編號.match(/\((\d{3})\)/);
    return match ? match[1] : "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // 防止内容溢出
          }}
        >
          <Typography variant="h5" gutterBottom>
            合約查詢
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="起始日期"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="結束日期"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleQuery}
                fullWidth
                sx={{ height: "56px" }}
              >
                查詢
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TableContainer sx={{ flex: 1, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>合約編號</TableCell>
                  <TableCell>年度</TableCell>
                  <TableCell>簽約廠商名稱</TableCell>
                  <TableCell>合約類型</TableCell>
                  <TableCell>合約名稱</TableCell>
                  <TableCell>合約起始日期</TableCell>
                  <TableCell>合約結束日期</TableCell>
                  <TableCell>金額(未稅)</TableCell>
                  <TableCell>申請人</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>內容</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract, index) => (
                  <TableRow key={index}>
                    <TableCell>{contract.data.合約編號 || "-"}</TableCell>
                    <TableCell>{getContractYear(contract.data)}</TableCell>
                    <TableCell>{contract.data.簽約廠商名稱 || "-"}</TableCell>
                    <TableCell>{contract.data.合約類型}</TableCell>
                    <TableCell>{contract.data.合約名稱}</TableCell>
                    <TableCell>{contract.data.合約起始日期}</TableCell>
                    <TableCell>{contract.data.合約結束日期}</TableCell>
                    <TableCell>
                      {contract.data["合約金額(未稅)"] || "-"}
                    </TableCell>
                    <TableCell>{contract.data.申請人}</TableCell>
                    <TableCell>{getContractStatus(contract.data)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewDetails(contract.data)}
                        size="small"
                      >
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>合約詳細內容</DialogTitle>
            <DialogContent dividers>
              {selectedContract && (
                <Grid container spacing={2}>
                  {Object.entries(selectedContract)
                    .filter(([key]) => key !== "row_number")
                    .map(([key, value]) => (
                      <Grid item xs={12} md={6} key={key}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {key}:
                        </Typography>
                        <Typography variant="body1">{value || "-"}</Typography>
                      </Grid>
                    ))}
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>關閉</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ContractQuery;
