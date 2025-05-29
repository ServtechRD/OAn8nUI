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
  Divider,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const CONTRACT_TYPES = ["一般合約", "採購合約", "銷售合約", "服務合約"];
const CONTRACT_CURRENCIES = ["新台幣", "美金", "人民幣", "歐元"];
const CONTRACT_FLOWS = ["收款", "付款"];
const CONTRACT_PAYMENT_TERMS = [
  "一期款",
  "二期款",
  "三期款",
  "四期款",
  "五期款",
];

const ContractRequest = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    時間戳記: new Date(),
    申請日期: new Date(),
    電子郵件: user?.email || "",
    請上傳合約電子檔: "",
    申請人: user?.姓名 || "",
    計畫代碼: "",
    計畫名稱: "",
    申請事由: "",
    合約名稱: "",
    合約類型: "一般合約",
    合約正本份數: 1,
    合約副本份數: 1,
    合約起始日期: new Date(),
    合約結束日期: new Date(),
    合約金流: "收款",
    合約幣值: "新台幣",
    合約金額未稅: 0,
    合約金額含稅: 0,
    收款付款銀行: "",
    簽約廠商名稱: "",
    簽約廠商統編: "",
    簽約代表人: "",
    廠商聯絡人: "",
    廠商聯絡電話: "",
    保固期間: "",
    預計交付日: new Date(),
    交付後多少工作日後: 0,
    合約收款付款期款: "一期款",
    一期款未稅金額: 0,
    一期款合約占比: 0,
    二期款未稅金額: 0,
    二期款合約占比: 0,
    三期款未稅金額: 0,
    三期款合約占比: 0,
    四期款未稅金額: 0,
    四期款合約占比: 0,
    五期款未稅金額: 0,
    五期款合約占比: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 准备提交数据
      const submitData = {
        ...formData,
        時間戳記: format(formData.時間戳記, "yyyy/MM/dd HH:mm:ss"),
        申請日期: format(formData.申請日期, "yyyy/MM/dd"),
        合約起始日期: format(formData.合約起始日期, "yyyy/MM/dd"),
        合約結束日期: format(formData.合約結束日期, "yyyy/MM/dd"),
        預計交付日: format(formData.預計交付日, "yyyy/MM/dd"),
        合約金額未稅: Number(formData.合約金額未稅),
        合約金額含稅: Number(formData.合約金額含稅),
        合約正本份數: Number(formData.合約正本份數),
        合約副本份數: Number(formData.合約副本份數),
        交付後多少工作日後: Number(formData.交付後多少工作日後),
        一期款未稅金額: Number(formData.一期款未稅金額),
        一期款合約占比: Number(formData.一期款合約占比),
        二期款未稅金額: Number(formData.二期款未稅金額),
        二期款合約占比: Number(formData.二期款合約占比),
        三期款未稅金額: Number(formData.三期款未稅金額),
        三期款合約占比: Number(formData.三期款合約占比),
        四期款未稅金額: Number(formData.四期款未稅金額),
        四期款合約占比: Number(formData.四期款合約占比),
        五期款未稅金額: Number(formData.五期款未稅金額),
        五期款合約占比: Number(formData.五期款合約占比),
      };

      const response = await axios.post(
        "https://cloud.servtech.com.tw:35678/webhook/4f179b48-06fc-4b6c-8ed9-911b5e1d24e3",
        submitData
      );

      if (response.data.success) {
        setSuccess("合約申請已成功提交");
        setOpenDialog(false);
        // 重置表单
        setFormData({
          ...formData,
          計畫代碼: "",
          計畫名稱: "",
          申請事由: "",
          合約名稱: "",
          合約正本份數: 1,
          合約副本份數: 1,
          合約金額未稅: 0,
          合約金額含稅: 0,
          收款付款銀行: "",
          簽約廠商名稱: "",
          簽約廠商統編: "",
          簽約代表人: "",
          廠商聯絡人: "",
          廠商聯絡電話: "",
          保固期間: "",
          交付後多少工作日後: 0,
          一期款未稅金額: 0,
          一期款合約占比: 0,
          二期款未稅金額: 0,
          二期款合約占比: 0,
          三期款未稅金額: 0,
          三期款合約占比: 0,
          四期款未稅金額: 0,
          四期款合約占比: 0,
          五期款未稅金額: 0,
          五期款合約占比: 0,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "提交失敗，請稍後重試");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        請上傳合約電子檔: file.name,
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            合約用印申請
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 3 }}
          >
            新增合約用印申請
          </Button>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
            scroll="paper"
          >
            <DialogTitle>合約用印申請表</DialogTitle>
            <DialogContent dividers>
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

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* 基本資訊 */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    基本資訊
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="時間戳記"
                    value={formData.時間戳記}
                    onChange={(date) =>
                      setFormData({ ...formData, 時間戳記: date })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="申請日期"
                    value={formData.申請日期}
                    onChange={(date) =>
                      setFormData({ ...formData, 申請日期: date })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="電子郵件"
                    value={formData.電子郵件}
                    onChange={(e) =>
                      setFormData({ ...formData, 電子郵件: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="申請人"
                    value={formData.申請人}
                    onChange={(e) =>
                      setFormData({ ...formData, 申請人: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="計畫代碼"
                    value={formData.計畫代碼}
                    onChange={(e) =>
                      setFormData({ ...formData, 計畫代碼: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="計畫名稱"
                    value={formData.計畫名稱}
                    onChange={(e) =>
                      setFormData({ ...formData, 計畫名稱: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="申請事由"
                    value={formData.申請事由}
                    onChange={(e) =>
                      setFormData({ ...formData, 申請事由: e.target.value })
                    }
                    multiline
                    rows={2}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="outlined" component="label" fullWidth>
                    上傳合約電子檔
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {formData.請上傳合約電子檔 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      已選擇檔案: {formData.請上傳合約電子檔}
                    </Typography>
                  )}
                </Grid>

                {/* 合約資訊 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    合約資訊
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="合約名稱"
                    value={formData.合約名稱}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約名稱: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="合約類型"
                    value={formData.合約類型}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約類型: e.target.value })
                    }
                    fullWidth
                    required
                  >
                    {CONTRACT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="合約正本份數"
                    value={formData.合約正本份數}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約正本份數: e.target.value })
                    }
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="合約副本份數"
                    value={formData.合約副本份數}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約副本份數: e.target.value })
                    }
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="合約起始日期"
                    value={formData.合約起始日期}
                    onChange={(date) =>
                      setFormData({ ...formData, 合約起始日期: date })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="合約結束日期"
                    value={formData.合約結束日期}
                    onChange={(date) =>
                      setFormData({ ...formData, 合約結束日期: date })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="合約金流"
                    value={formData.合約金流}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約金流: e.target.value })
                    }
                    fullWidth
                    required
                  >
                    {CONTRACT_FLOWS.map((flow) => (
                      <MenuItem key={flow} value={flow}>
                        {flow}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="合約幣值"
                    value={formData.合約幣值}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約幣值: e.target.value })
                    }
                    fullWidth
                    required
                  >
                    {CONTRACT_CURRENCIES.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="合約金額(未稅)"
                    value={formData.合約金額未稅}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約金額未稅: e.target.value })
                    }
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="合約金額(含稅)"
                    value={formData.合約金額含稅}
                    onChange={(e) =>
                      setFormData({ ...formData, 合約金額含稅: e.target.value })
                    }
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="收款/付款銀行"
                    value={formData.收款付款銀行}
                    onChange={(e) =>
                      setFormData({ ...formData, 收款付款銀行: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                {/* 廠商資訊 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    廠商資訊
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="簽約廠商名稱"
                    value={formData.簽約廠商名稱}
                    onChange={(e) =>
                      setFormData({ ...formData, 簽約廠商名稱: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="簽約廠商統編"
                    value={formData.簽約廠商統編}
                    onChange={(e) =>
                      setFormData({ ...formData, 簽約廠商統編: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="簽約代表人"
                    value={formData.簽約代表人}
                    onChange={(e) =>
                      setFormData({ ...formData, 簽約代表人: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="廠商聯絡人"
                    value={formData.廠商聯絡人}
                    onChange={(e) =>
                      setFormData({ ...formData, 廠商聯絡人: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="廠商聯絡電話"
                    value={formData.廠商聯絡電話}
                    onChange={(e) =>
                      setFormData({ ...formData, 廠商聯絡電話: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="保固期間"
                    value={formData.保固期間}
                    onChange={(e) =>
                      setFormData({ ...formData, 保固期間: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="預計交付日"
                    value={formData.預計交付日}
                    onChange={(date) =>
                      setFormData({ ...formData, 預計交付日: date })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="交付後多少工作日後"
                    value={formData.交付後多少工作日後}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        交付後多少工作日後: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {/* 付款資訊 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    付款資訊
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="合約收款/付款期款"
                    value={formData.合約收款付款期款}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        合約收款付款期款: e.target.value,
                      })
                    }
                    fullWidth
                    required
                  >
                    {CONTRACT_PAYMENT_TERMS.map((term) => (
                      <MenuItem key={term} value={term}>
                        {term}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* 一期款 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="一期款未稅金額"
                    value={formData.一期款未稅金額}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        一期款未稅金額: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="一期款合約占比(%)"
                    value={formData.一期款合約占比}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        一期款合約占比: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                {/* 二期款 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="二期款未稅金額"
                    value={formData.二期款未稅金額}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        二期款未稅金額: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="二期款合約占比(%)"
                    value={formData.二期款合約占比}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        二期款合約占比: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                {/* 三期款 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="三期款未稅金額"
                    value={formData.三期款未稅金額}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        三期款未稅金額: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="三期款合約占比(%)"
                    value={formData.三期款合約占比}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        三期款合約占比: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                {/* 四期款 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="四期款未稅金額"
                    value={formData.四期款未稅金額}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        四期款未稅金額: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="四期款合約占比(%)"
                    value={formData.四期款合約占比}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        四期款合約占比: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                {/* 五期款 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="五期款未稅金額"
                    value={formData.五期款未稅金額}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        五期款未稅金額: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="number"
                    label="五期款合約占比(%)"
                    value={formData.五期款合約占比}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        五期款合約占比: e.target.value,
                      })
                    }
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>取消</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                提交
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ContractRequest;
