import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Divider } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import KeyboardIcon from '@material-ui/icons/Keyboard';
// import Eanlogo from "../../../assets/icons/ScanIcon.svg";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from "@material-ui/core/InputAdornment";
// import { isUserSupervisorHq } from '../../../helpers/Utility'
import CloseIcon from "@material-ui/icons/CloseRounded";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  inputScan: {
    marginTop: 10
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 50,
    margin: 4,
    width: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 60,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  btnPrimary: {
    height: 40
  },
  buttonProgress: {
    // color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  selectNo: {
    width: 60
  }
}));

function EanValidationField(props) {
  const classes = useStyles();
  const [number, setNumber] = React.useState(20);
  const [validateSuccess, setValidateSuccess] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [awbNumber, setAWBNumber] = useState("");
  const [helperTextVal, setHelperTextValue] = useState("");
  const [error, setError] = useState(false);

  let barCodeInputArr = [];

  let clearTimer = null;

  let isChecked = props.isChecked ? props.isChecked : false

  let passWithoutEan = props.passWithoutEan ? props.passWithoutEan : false


  const handleChange = event => {
    setNumber(event.target.value)
  };

  function validateEan(awbNumber) {
    if (awbNumber) {
      setIsValidate(true);
      if (awbNumber === props.ean) {
        setValidateSuccess(true);
      } else {
        setValidateSuccess(false);
      }
    }
  }

  const handleAWBWithKeyBoard = event => {
    const { value } = event.target
    barCodeInputArr.push(value);
    barCodeInputArr.join("");
    setAWBNumber(barCodeInputArr);
    if (barCodeInputArr[0] === "") {
      setValidateSuccess(false)
      setAWBNumber("");
      setHelperTextValue("");
      setError(false);
    }
  };

  function toHandleAwb() {
    setHelperTextValue("");
    setError(false);
    setAWBNumber("")
  }

  function KeyBoardSubmitBtn() {
    setIsValidate(false);
    let toMakeArrToNum = awbNumber.join();
    if (props.ean === toMakeArrToNum || passWithoutEan) {
      props.callback(toMakeArrToNum, props.data);
      setHelperTextValue("");
      setError(false);
    } else {
      setHelperTextValue("Please scan correct EAN");
      setError(true);
    }
    validateEan(toMakeArrToNum);
    barCodeInputArr.length = 0
  }



  const handleAWBWithScanner = event => {
    if (clearTimer) {
      clearTimeout(clearTimer);
    }
    clearTimer = setTimeout(() => {
      barCodeInputArr.length = 0
    }, 200);

    setAWBNumber("");
    let toMakeArrToNum;
    barCodeInputArr.push(event.key);
    if ((barCodeInputArr[barCodeInputArr.length - 1] === "Enter" || barCodeInputArr[barCodeInputArr.length - 1] === "Tab") && !awbNumber) {
      setIsValidate(false);
      toMakeArrToNum = barCodeInputArr.slice(0, -1).join("");
      if (props.ean === toMakeArrToNum || passWithoutEan) {
        setValidateSuccess(true)
        props.callback(toMakeArrToNum, props.data);
        setHelperTextValue("");
        setError(false);
      } else {
        setHelperTextValue("Please scan correct EAN");
        setError(true);
      }
      setAWBNumber(toMakeArrToNum);
      validateEan(toMakeArrToNum);
      barCodeInputArr.length = 0
    }
  };

  return (
    <Grid container alignItems="center">
      <Grid item>
        <TextField
          select
          labelId="demo-simple-select-filled-label"
          className={classes.selectNo}
          id="demo-simple-select-filled"
          disabled={validateSuccess || props.disable || !isUserSupervisorHq()}
          value={number}
          IconComponent={props => (
            <i {...props} className={`material-icons ${props.className}`}>
              {number === 10 ? <KeyboardIcon style={{ opacity: 0 }} /> : (
                <img
                  alt="logo"
                  src={Eanlogo}
                  style={{ opacity: 0 }}
                />
              )}
              <ArrowDropDownIcon />
            </i>
          )}
          onChange={e => handleChange(e)}
        >
          <MenuItem value={10}>
            <span style={{ display: 'flex' }}>
              <ListItemIcon>
                <KeyboardIcon color="primary" style={{ marginTop: 4 }} />
              </ListItemIcon>
            </span>
          </MenuItem>
          <MenuItem value={20}>
            <span style={{ display: 'flex' }}>
              <ListItemIcon>
                <img
                  alt="logo"
                  src={Eanlogo}
                  style={{ width: '25px', marginTop: 10 }}
                />
              </ListItemIcon>
            </span>
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item>
        <Divider className={classes.divider} orientation="vertical" />
      </Grid>
      <Grid item>
        {isUserSupervisorHq() && !isChecked && number === 10 ? (
          <div style={{ display: 'flex' }}>
            <TextField
              id="outlined-required"
              label="Enter EAN"
              autoComplete="off"
              className={classes.input}
              placeholder='Keyboard'
              disabled={isChecked || props.disable}
              autoFocus
              style={{ width: 130, marginBottom: 10 }}
              value={awbNumber}
              onChange={handleAWBWithKeyBoard}
              helperText={helperTextVal}
              error={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                    {awbNumber !== "" ? isValidate && !passWithoutEan && (<span>
                      {isChecked ? <CheckCircleIcon style={{ color: "green" }} /> : <CancelIcon style={{ color: "red" }} />}
                    </span>) : null}
                    {awbNumber !== "" && <CloseIcon onClick={toHandleAwb} disabled={props.disable} />}
                  </InputAdornment>
                )
              }}
            />
            {!isChecked ? (<div className={classes.wrapper}>
              <Button variant="contained" color="primary" disabled={awbNumber === '' || props.btnLoading === true} onClick={() => KeyBoardSubmitBtn()}>
                Add
            </Button>
              {props.btnLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>) : null}
          </div>
        ) : (
            !isChecked ? (
              <TextField
                id="outlined-required"
                label="Scan EAN"
                className={classes.input}
                autoComplete="off"
                style={{ width: 160, marginBottom: 10 }}
                // inputRef={inputRef}
                placeholder='Barcode Scanner'
                // autoFocus={true}
                value={awbNumber}
                helperText={helperTextVal}
                error={error}
                disabled={validateSuccess || props.disable}
                onKeyDown={handleAWBWithScanner}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                      {awbNumber !== "" && isValidate && !passWithoutEan && (<span>
                        {(isChecked || validateSuccess) ? <CheckCircleIcon style={{ color: "green" }} /> : <CancelIcon style={{ color: "red" }} />}
                      </span>)}
                      {awbNumber !== "" && <CloseIcon onClick={toHandleAwb} disabled={props.disable} />}
                    </InputAdornment>
                  )
                }}
              />
            ) : (
                <TextField
                  id="outlined-required"
                  label="Scan EAN"
                  className={classes.input}
                  autoComplete="off"
                  style={{ width: 160, marginBottom: 10 }}
                  // inputRef={inputRef}
                  placeholder='Barcode Scanner'
                  // autoFocus={true}
                  value={props.ean}
                  disabled={true}
                  helperText={helperTextVal}
                  error={error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                        <span>
                          {isChecked ? <CheckCircleIcon style={{ color: "green" }} /> : <CancelIcon style={{ color: "red" }} />}
                        </span>

                      </InputAdornment>
                    )
                  }}
                />
              )
          )}
      </Grid>
    </Grid >
  )
}

export default EanValidationField;

