import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { DataGrid } from "@mui/x-data-grid";

const CONTRACT_TYPES = ["採購合約", "銷售合約", "服務合約", "其他合約"];
const CONTRACT_STATUS = ["待審核", "審核中", "已通過", "已拒絕"];

const ContractQuery = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [searchParams, setSearchParams] = useState({
    contractType: "",
    contractNumber: "",
    contractName: "",
    status: "",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const columns = [
    { field: "contractNumber", headerName: "合約編號", width: 150 },
    { field: "contractName", headerName: "合約名稱", width: 200 },
    { field: "contractType", headerName: "合約類型", width: 120 },
    { field: "contractParty", headerName: "合約方", width: 150 },
    {
      field: "contractDate",
      headerName: "合約日期",
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), "yyyy/MM/dd"),
    },
    {
      field: "contractAmount",
      headerName: "合約金額",
      width: 120,
      valueFormatter: (params) => `NT$ ${params.value.toLocaleString()}`,
    },
    { field: "status", headerName: "狀態", width: 100 },
    {
      field: "actions",
      headerName: "操作",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(params.row)}
        >
          查看詳情
        </Button>
      ),
    },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      // TODO: 实现合约查询逻辑
      // 模拟数据
      const mockData = [
        {
          id: 1,
          contractNumber: "C2024001",
          contractName: "測試合約1",
          contractType: "採購合約",
          contractParty: "測試公司",
          contractDate: new Date(),
          contractAmount: 100000,
          status: "待審核",
        },
      ];
      setContracts(mockData);
    } catch (err) {
      setError(err.response?.data?.message || "查詢失敗，請稍後重試");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setDetailDialogOpen(true);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            合約查詢
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="合約類型"
                value={searchParams.contractType}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    contractType: e.target.value,
                  })
                }
                fullWidth
              >
                <MenuItem value="">全部</MenuItem>
                {CONTRACT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="合約編號"
                value={searchParams.contractNumber}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    contractNumber: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                label="合約名稱"
                value={searchParams.contractName}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    contractName: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select
                label="狀態"
                value={searchParams.status}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, status: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="">全部</MenuItem>
                {CONTRACT_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <DatePicker
                label="開始日期"
                value={searchParams.startDate}
                onChange={(date) =>
                  setSearchParams({ ...searchParams, startDate: date })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <DatePicker
                label="結束日期"
                value={searchParams.endDate}
                onChange={(date) =>
                  setSearchParams({ ...searchParams, endDate: date })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
              >
                查詢
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={contracts}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              loading={loading}
              disableSelectionOnClick
            />
          </div>
        </Paper>

        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>合約詳情</DialogTitle>
          <DialogContent>
            {selectedContract && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約編號</Typography>
                  <Typography>{selectedContract.contractNumber}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約名稱</Typography>
                  <Typography>{selectedContract.contractName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約類型</Typography>
                  <Typography>{selectedContract.contractType}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約方</Typography>
                  <Typography>{selectedContract.contractParty}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約日期</Typography>
                  <Typography>
                    {format(
                      new Date(selectedContract.contractDate),
                      "yyyy/MM/dd"
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">合約金額</Typography>
                  <Typography>
                    NT$ {selectedContract.contractAmount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">狀態</Typography>
                  <Typography>{selectedContract.status}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>關閉</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ContractQuery;
