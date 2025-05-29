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
import { format } from "date-fns";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";

const ContractQuery = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!startDate || !endDate) {
      setError("請選擇起始日期和結束日期");
      return;
    }

    try {
      const response = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook-test/1a02ada6-cca4-4146-a527-7f47a7e09a31",
        {
          startDate: format(startDate, "yyyy/MM/dd"),
          endDate: format(endDate, "yyyy/MM/dd"),
        }
      );

      if (response.data) {
        setContracts(response.data);
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
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
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

          <TableContainer>
            <Table>
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
                  {Object.entries(selectedContract).map(([key, value]) => (
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
