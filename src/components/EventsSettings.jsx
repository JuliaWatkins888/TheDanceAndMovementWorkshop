import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../firebaseConfig';  
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button, CircularProgress, Dialog, DialogContent, TextField, IconButton, Snackbar, Alert, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoFont from './LogoFont';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';

function EventsSettings() {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formValues, setFormValues] = useState({
        Name: '',
        Description: '',
        StartDate: '',
        EndDate: '',
        PromoEndDate: '',
        Image: '',
        PayLink: '',
        StandardFee: '',
        EarlyBirdFee: '',
        PromoPayLink: '',
        PromoEmbedCode: '',
        AgeRestriction: '',
        EmbedCode: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [imageSource, setImageSource] = useState('url'); 
    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState({
        Name: '',
        Description: '',
        StartDate: '',
        EndDate: '',
        StandardFee: '',
        PayLink: '',
        AgeRestriction: '',
        EmbedCode: ''
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventSnapshot = await getDocs(collection(db, 'Events'));
                const eventData = [];
                eventSnapshot.forEach((doc) => {
                    eventData.push({ id: doc.id, ...doc.data() });
                });
                setEvents(eventData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchEvents();
    }, [snackbarOpen]);

    const handleClickOpen = (event) => {
        setSelectedEvent(event);
        setFormValues({
            Name: event.Name,
            Description: event.Description,
            StartDate: formatDate(event.StartDate),
            EndDate: formatDate(event.EndDate),
            PromoEndDate: formatDate(event.PromoEndDate),
            Image: event.Image,
            PayLink: event.PayLink,
            StandardFee: event.StandardFee,
            EarlyBirdFee: event.EarlyBirdFee,
            PromoPayLink: event.PromoPayLink,
            PromoEmbedCode: event.PromoEmbedCode,
            AgeRestriction: event.AgeRestriction,
            EmbedCode: event.EmbedCode
        });
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedEvent(null);
        handleInit()
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormErrors({
            Name: '',
            Description: '',
            StartDate: '',
            EndDate: '',
            StandardFee: '',
            PayLink: '',
            AgeRestriction: '',
            EmbedCode: ''
        })
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    
    const handleImageSourceChange = (e) => {
        setImageSource(e.target.value);
        if (e.target.value === 'url') {
            setFormValues(prev => ({
                ...prev,
                Image: '' 
            }));
        }
    };
    
    const handleSave = async () => {
        try {
            if (imageSource === 'upload' && file) {
                const storageRef = ref(storage, `events/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                formValues.Image = downloadURL;
            }
    
            const formatDate = (date) => {
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${month}-${day}-${year}`;
            };
    
            console.log(formValues.StartDate)
            console.log(formValues.EndDate)
            console.log(formValues.PromoEndDate)
            
            const eventRef = doc(db, 'Events', selectedEvent.id);
            await updateDoc(eventRef, {
                ...formValues,
                StartDate: formValues.StartDate,
                EndDate: formValues.EndDate,
                PromoEndDate: formValues.PromoEndDate,
            });
    
            setSnackbarMessage('Event updated successfully!');
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            setSnackbarMessage("Error updating event!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };  

    const handleDelete = async () => {
        try {
            const eventRef = doc(db, 'Events', selectedEvent.id);
            await deleteDoc(eventRef);
    
            setEvents(events.filter((event) => event.id !== selectedEvent.id));
            setSnackbarMessage('Event deleted successfully!');
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleInit = () => {
        setFormValues({
            Name: '',
            Description: '',
            StartDate: '',
            EndDate: '',
            PromoEndDate: '',
            Image: '',
            PayLink: '',
            StandardFee: '',
            EarlyBirdFee: '',
            PromoPayLink: '',
            PromoEmbedCode: '',
            AgeRestriction: '',
            EmbedCode: ''
        })
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (!formValues.Name.trim()) {
            errors.Name = 'Event Name is required';
            isValid = false;
        }
        if (!formValues.Description.trim()) {
            errors.Description = 'Description is required';
            isValid = false;
        }
        if (!formValues.StartDate) {
            errors.StartDate = 'Start Date is required';
            isValid = false;
        }
        if (!formValues.EndDate) {
            errors.EndDate = 'End Date is required';
            isValid = false;
        }
        if (!formValues.StandardFee.trim()) {
            errors.StandardFee = 'Standard Fee is required';
            isValid = false;
        }
        if (!formValues.PayLink.trim()) {
            errors.PayLink = 'Pay Link is required';
            isValid = false;
        }
        if (!formValues.AgeRestriction.trim()) {
            errors.AgeRestriction = 'Age Restriction is required';
            isValid = false;
        }
        if (!formValues.EmbedCode.trim()) {
            errors.EmbedCode = 'Embed Code is required';
            isValid = false;
        }
    
        setFormErrors(errors);
        return isValid;
    };
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0'); 
        return `${year}-${month}-${day}`;
    }
    
    function formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0'); 
        return `${month}-${day}-${year}`;
    }

    const handleNewEventSave = async () => {
        const isValid = validateForm();
        if (!isValid) {
            return; 
        }
    
        console.log(
            {...formValues,
            StartDate: formValues.StartDate,
            EndDate: formValues.EndDate,
            PromoEndDate: formValues.PromoEndDate,
            Image: formValues.Image || ''}
        )

        try {
            const eventRef = doc(collection(db, 'Events')); 
            await setDoc(eventRef, {
                ...formValues,
                StartDate: formValues.StartDate,
                EndDate: formValues.EndDate,
                PromoEndDate: formValues.PromoEndDate,
                Image: formValues.Image || ''
            });

            setSnackbarMessage('Event created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleInit(); 
        } catch (error) {
            setSnackbarMessage('Error creating event!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', margin: isMobile ? '0px' : '0px 0px 0px 16px', padding: '10px' }}>
            <LogoFont
                text='Events'
                fontColor={theme.black}
                fontWeight={700}
                fontAlign="center"
                fontMargin="0px 0px 10px 0px"
                fontSize='20px'
                fontType="secondary"
            />
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <LogoFont
                        text='Edit & Delete'
                        fontColor={theme.black}
                        fontWeight={500}
                        fontMargin="10px 0px 0px 0px"
                        fontType="secondary"
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {loading ? (
                        <CircularProgress />
                    ) : events.length > 0 ? (
                        events.map((event) => (
                            <Box onClick={() => handleClickOpen(event)} key={event.id} style={{ display: 'flex', cursor: 'pointer', flexDirection: 'row', marginBottom: '10px', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '16px' }}>
                                <img src={event.Image} alt={event.Name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                                <Box>
                                    <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                        <LogoFont
                                            text={event.Name}
                                            fontColor={theme.black}
                                            fontWeight={400}
                                            fontMargin="0px 0px 10px 0px"
                                            fontSize='18px'
                                            fontType="secondary"
                                        />
                                        <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '8px'}}>
                                            <CalendarMonthIcon style={{marginRight: '8px', color: theme.primary}} />
                                            <Typography variant="body2">
                                                {`${formatDateForDisplay(event.StartDate)} - ${formatDateForDisplay(event.EndDate)}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2">{event.Description}</Typography>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No events available.</Typography>
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => {handleInit()}}>
                    <LogoFont
                        text='Add New'
                        fontColor={theme.black}
                        fontWeight={500}
                        fontMargin="10px 0px 0px 0px"
                        fontType="secondary"
                    />
                </AccordionSummary>
                <AccordionDetails>
                <Typography variant="h6" gutterBottom>General</Typography>
                    <Box component="form" noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <TextField
                            label="Event Name"
                            name="Name"
                            value={formValues.Name}
                            onChange={handleChange}
                            variant="outlined"
                            error={Boolean(formErrors.Name)}
                            helperText={formErrors.Name}
                        />
                        <TextField
                            label="Description"
                            name="Description"
                            value={formValues.Description}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={4}
                            error={Boolean(formErrors.Description)}
                            helperText={formErrors.Description}
                        />
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            <TextField
                                label="Start Date"
                                name="StartDate"
                                type="date"
                                fullWidth
                                value={formValues.StartDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                error={Boolean(formErrors.StartDate)}
                                helperText={formErrors.StartDate}
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="End Date"
                                name="EndDate"
                                type="date"
                                fullWidth
                                value={formValues.EndDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                error={Boolean(formErrors.EndDate)}
                                helperText={formErrors.EndDate}
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            
                            <TextField
                                label="Standard Fee"
                                name="StandardFee"
                                value={formValues.StandardFee}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                error={Boolean(formErrors.StandardFee)}
                                helperText={formErrors.StandardFee}
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="Pay Link"
                                name="PayLink"
                                value={formValues.PayLink}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                error={Boolean(formErrors.PayLink)}
                                helperText={formErrors.PayLink}
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <TextField
                            label="Age Restriction"
                            name="AgeRestriction"
                            value={formValues.AgeRestriction}
                            onChange={handleChange}
                            error={Boolean(formErrors.AgeRestriction)}
                            helperText={formErrors.AgeRestriction}
                            variant="outlined"
                        />
                        <TextField
                            label="Embed Code"
                            name="EmbedCode"
                            value={formValues.EmbedCode}
                            error={Boolean(formErrors.EmbedCode)}
                            helperText={formErrors.EmbedCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Typography variant="h6" gutterBottom>Promo</Typography>
                        <TextField
                            label="Promo End Date"
                            name="PromoEndDate"
                            type="date"
                            value={formValues.PromoEndDate}
                            onChange={handleChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            <TextField
                                label="Early Bird Fee"
                                name="EarlyBirdFee"
                                value={formValues.EarlyBirdFee}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="Promo Pay Link"
                                name="PromoPayLink"
                                value={formValues.PromoPayLink}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <TextField
                            label="Promo Embed Code"
                            name="PromoEmbedCode"
                            value={formValues.PromoEmbedCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Typography variant="h6" gutterBottom>Image</Typography>
                        
                        {imageSource === 'url' && (
                            <TextField
                                label="Image URL"
                                name="Image"
                                value={formValues.Image}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        {imageSource === 'upload' && (
                            <Box>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ marginBottom: '10px' }}
                                />
                                {file && (
                                    <Typography variant="body2">Selected file: {file.name}</Typography>
                                )}
                            </Box>
                        )}
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Image Source</FormLabel>
                            <RadioGroup row value={imageSource} onChange={handleImageSourceChange}>
                                <FormControlLabel value="url" control={<Radio />} label="URL" />
                                <FormControlLabel value="upload" control={<Radio />} label="Upload" />
                            </RadioGroup>
                        </FormControl>
                        <Box style={{display: 'flex', flexDirection: 'row', flex: 1, padding: '0px 16px'}}>
                            <Box style={{display: 'flex', flexDirection: 'row', flex: 1}}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleNewEventSave}
                                    sx={{ 
                                        mb: 2,
                                        backgroundColor: theme.primary,
                                        '&:hover': {
                                            backgroundColor: theme.secondary,
                                        },
                                    }}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
            
            <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogContent>
                    <Typography variant="h6" gutterBottom>General</Typography>
                    <Box component="form" noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <TextField
                            label="Event Name"
                            name="Name"
                            value={formValues.Name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            label="Description"
                            name="Description"
                            value={formValues.Description}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={4}
                        />
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            <TextField
                                label="Start Date"
                                name="StartDate"
                                type="date"
                                fullWidth
                                value={formValues.StartDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="End Date"
                                name="EndDate"
                                type="date"
                                fullWidth
                                value={formValues.EndDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            
                            <TextField
                                label="Standard Fee"
                                name="StandardFee"
                                value={formValues.StandardFee}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="Pay Link"
                                name="PayLink"
                                value={formValues.PayLink}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <TextField
                            label="Age Restriction"
                            name="AgeRestriction"
                            value={formValues.AgeRestriction}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            label="Embed Code"
                            name="EmbedCode"
                            value={formValues.EmbedCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Typography variant="h6" gutterBottom>Promo</Typography>
                        <TextField
                            label="Promo End Date"
                            name="PromoEndDate"
                            type="date"
                            value={formValues.PromoEndDate}
                            onChange={handleChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box style={{display: 'flex', flexDirection: 'row'}}>
                            <TextField
                                label="Early Bird Fee"
                                name="EarlyBirdFee"
                                value={formValues.EarlyBirdFee}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1, marginRight: '16px'}}
                            />
                            <TextField
                                label="Promo Pay Link"
                                name="PromoPayLink"
                                value={formValues.PromoPayLink}
                                fullWidth
                                onChange={handleChange}
                                variant="outlined"
                                style={{display: 'flex', flexDirection: 'row', flex: 1}}
                            />
                        </Box>
                        <TextField
                            label="Promo Embed Code"
                            name="PromoEmbedCode"
                            value={formValues.PromoEmbedCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Typography variant="h6" gutterBottom>Image</Typography>
                        
                        {imageSource === 'url' && (
                            <TextField
                                label="Image URL"
                                name="Image"
                                value={formValues.Image}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        )}
                        {imageSource === 'upload' && (
                            <Box>
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ marginBottom: '10px' }}
                                />
                                {file && (
                                    <Typography variant="body2">Selected file: {file.name}</Typography>
                                )}
                            </Box>
                        )}
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Image Source</FormLabel>
                            <RadioGroup row value={imageSource} onChange={handleImageSourceChange}>
                                <FormControlLabel value="url" control={<Radio />} label="URL" />
                                <FormControlLabel value="upload" control={<Radio />} label="Upload" />
                            </RadioGroup>
                        </FormControl>
                        <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, padding: '0px 16px'}}>
                            <Box style={{display: 'flex', flexDirection: 'column', flex: 1, margin: '0px 10px 0px 0px'}}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={handleDelete}
                                    sx={{ 
                                        mb: 2,
                                        backgroundColor: theme.primary,
                                        '&:hover': {
                                            backgroundColor: theme.secondary,
                                        },
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                            <Box style={{display: 'flex', flexDirection: 'row', flex: 1}}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{ 
                                        mb: 2, 
                                    }}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventsSettings;
