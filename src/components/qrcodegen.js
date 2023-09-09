import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios';
import { TextField } from '@mui/material';
import CustomSnackbar from './snackbar';
export default function QrcodeGeneration()
{
    const [color, setColor] = useState('#000000');
    const [bgcolor,setBgcolor]=useState('#FFFFFF')
    const [qrData, setQrData] = useState('');
    const [format, setFormat] = useState('png'); // Default format
    const [qrImageUrl, setQrImageUrl] = useState('');
    const [width,setWidth]=useState(200)
    const [height,setHeight]=useState(200)
    const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
   
  };
    const handleWidth=(e)=>{
        if(e.target.value>200 && e.target.value<1000 && typeof(width)==='number')
        {
            setWidth(e.target.value)
        }
    }
    const handleHeight=(e)=>{
        if(e.target.value>200 && e.target.value<1000 && typeof(height)==='number')
        {
            setHeight(e.target.value)
        }
    }
    const handleChangeComplete = (newColor) => {
        setColor(newColor.hex);
        };
    const handleChangeBgComplete = (newColor) => {
            setBgcolor(newColor.hex);
            };
    function handleQrgen()
    {
        const colorWithoutHash = color.substring(1);
        const bgcolorwithoutHash=bgcolor.substring(1);
        if(qrData.length!==0 && width===height)
        {
            console.log(qrData,colorWithoutHash,bgcolorwithoutHash,width,height,format)
            const qrCodeAPIUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${width}x${height}&color=${colorWithoutHash}&bgcolor=${bgcolorwithoutHash}&format=${format}&data=${encodeURIComponent(qrData)}`;

// Store the QR code image URL
setQrImageUrl(qrCodeAPIUrl);
        }
        else if(width!==height)
        {
            setSnackbarMessage('Please provide equal width and height!');
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
        }
      
        else{
            setSnackbarMessage('Please provide required data!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }
    function handleDownload()
    {
        if (qrImageUrl) {
            // Make a request to download the QR code image
            axios.get(qrImageUrl, { responseType: 'arraybuffer' })
            .then((response) => {
            // Create a Blob from the response data
            const blob = new Blob([response.data], { type: `image/${format}` });
            
            // Create an object URL from the Blob
            const url = URL.createObjectURL(blob);
            
            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode.${format}`;
            a.click();
            
            // Revoke the object URL to release resources
            URL.revokeObjectURL(url);
            })
            .catch((error) => {
            console.error('Error downloading QR code:', error);
            });
            }
    }
   
    return(
        <div className="qrcodegen-container">
           <div className="qrform">
           <TextField
          id="filled-multiline-flexible"
          label="Enter Data"
          multiline
          maxRows={4}
          variant="standard"
          color='secondary'
          onChange={(e)=>{setQrData(e.target.value)}}
        />
        <TextField
          id="widthvalue"
          label="Width"
          type='number'
          placeholder='width ranges 10-1000'
          variant="standard"
          color='secondary'
         onChange={(e)=>{handleWidth(e)}}
        />
        <TextField
          id="heightvalue"
          label="Height"
          type='number'
          placeholder='height ranges 10-1000'
          variant="standard"
          color='secondary'
          onChange={(e)=>{handleHeight(e)}}
        />
        <div className='sketch-parent'>
            <div className='sk-child'>
                <label>COLOR FOR QR CODE</label>
            <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        <div style={{ backgroundColor: color, width: '150px', height: '50px' }}></div>
            </div>
            <div className='sk-child'>
                <label> BGCOLOR FOR QR CODE </label>
            <SketchPicker color={bgcolor} onChangeComplete={handleChangeBgComplete} />
        <div style={{ backgroundColor: bgcolor, width: '150px', height: '50px' }}></div>
            </div>

        </div>
        
       
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">FORMAT</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={format}
          label="format"
          onChange={(e)=>{setFormat(e.target.value)}}
        >
          <MenuItem value="png">PNG</MenuItem>
          <MenuItem value="jpeg">JPEG</MenuItem>
          <MenuItem value="svg">SVG</MenuItem>
        </Select>
      </FormControl>
      
      <Button variant='contained' color='secondary' onClick={handleQrgen}>GENERATE QR CODE</Button>
        
           </div>
           <div className="qrimage">
           {qrImageUrl && (
            <div>
            <img src={qrImageUrl} className='qrimgcls' alt="QR Code" />
            </div>
            )}
            <Button variant='contained' color='success' onClick={handleDownload} disabled={qrImageUrl===''}>
                download qr code
            </Button>
           </div>
           <CustomSnackbar
                            open={openSnackbar}
                            message={snackbarMessage}
                            severity={snackbarSeverity}
                            onClose={handleSnackbarClose}   
                           
                         />
        </div>
    )
}