import React, { useEffect, useState } from 'react';
import { setPages } from '../actions/actions';
import { useSelector, useDispatch } from 'react-redux';
import { db, storage } from '../firebaseConfig'; 
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { setSocials } from '../actions/actions';
import { ref, uploadBytes } from 'firebase/storage'; 
import Login from '../components/Login';
import { Box, TextField, Button, Snackbar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SketchPicker } from 'react-color';
import LogoFont from '../components/LogoFont';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function GeneralSettings() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const pages = useSelector((state) => state.pages);
    const socials = useSelector((state) => state.socials);
    const [copy, setCopy] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [colors, setColors] = useState([]);
    const [activeColorIndex, setActiveColorIndex] = useState(null); 
    const [file, setFile] = useState(null); 

    useEffect(() => {
        const fetchCopy = async () => {
            const q = query(collection(db, 'BodyCopy'), where('Location', '==', 'home'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    setCopy(doc.data().Copy);
                });
            }
            setLoading(false);
        };

        const fetchColors = async () => {
            const colorsSnapshot = await getDocs(collection(db, 'Colors'));
            const colorsData = [];
            colorsSnapshot.forEach((doc) => {
                colorsData.push({ id: doc.id, ...doc.data() });
            });
            setColors(colorsData);
        };

        fetchCopy();
        fetchColors();
    }, []);
      
    const handleSave = async () => {
        const q = query(collection(db, 'BodyCopy'), where('Location', '==', 'home'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            try {
                await setDoc(docRef, { Copy: copy }, { merge: true });
                setSnackbarMessage("Content updated successfully!");
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage("Error updating content!");
                setSnackbarSeverity('error');
            }
        } else {
            setSnackbarMessage("No document found to update!");
            setSnackbarSeverity('error');
        }

        await Promise.all(colors.map(async (color) => {
            const colorRef = doc(db, 'Colors', color.id);
            await setDoc(colorRef, { Color: color.Color, Hex: color.Hex }, { merge: true });
        }));

        await Promise.all(pages.map(async (page) => {
            const pageRef = doc(db, 'Pages', page.id);
            await setDoc(pageRef, {Name: page.Name, Active: page.Active }, { merge: true });
        }));
        
        await Promise.all(socials.map(async (social) => {
            const socialRef = doc(db, 'Socials', social.id);
            await setDoc(socialRef, { Name: social.Name, Link: social.Link, Active: social.Active }, { merge: true });
        }));

        if (file) {
            const storageRef = ref(storage, 'hero.png'); 
            try {
                await uploadBytes(storageRef, file);
                setSnackbarMessage("Image updated successfully!");
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage("Error updating image!");
                setSnackbarSeverity('error');
            }
        }

        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleColorChange = (color, index) => {
        const newColors = [...colors];
        newColors[index].Hex = color.hex;
        setColors(newColors);
    };

    const toggleColorPicker = (index) => {
        setActiveColorIndex(activeColorIndex === index ? null : index);
    };

    const handlePageChange = (pageName, boolean) => {
        const updatedPages = pages.map(page => 
            page.Name === pageName ? { ...page, Active: boolean } : page
        );
        dispatch(setPages(updatedPages));
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleURLChange = (id, newURL) => {
        const updatedSocials = socials.map((social) => 
            social.id === id ? { ...social, Link: newURL } : social
        );
        dispatch(setSocials(updatedSocials)); 
    };

    const handleSocialChange = (id, active) => {
        const updatedSocials = socials.map((social) => 
            social.id === id ? { ...social, Active: active } : social
        );
        dispatch(setSocials(updatedSocials));
    };  

    if (!isLoggedIn) {
        return <Login />;
    }
  
    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <Box>
            <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px'}}>
                <LogoFont
                    text='General Settings'
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
                            text='Active Pages'
                            fontColor={theme.black}
                            fontWeight={500}
                            fontMargin="10px 0px 0px 0px"
                            fontType="secondary"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                    <FormGroup>
                        {pages.map((page) => (
                            <FormControlLabel 
                                key={page.id} 
                                control={
                                    <Checkbox 
                                        onChange={() => {handlePageChange(page.Name, !page.Active)}}
                                        sx={{
                                            color: theme.secondary,
                                            '&.Mui-checked': {
                                            color: theme.primary,
                                            },
                                        }}
                                        defaultChecked={page.Active} 
                                    />
                                } 
                                label={page.Name} 
                            />
                        ))}
                    </FormGroup>

                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <LogoFont
                            text='Home page text'
                            fontColor={theme.black}
                            fontWeight={500}
                            fontMargin="10px 0px 0px 0px"
                            fontType="secondary"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={copy}
                            onChange={(e) => setCopy(e.target.value)}
                            variant="outlined"
                            style={{ marginTop: '10px' }}
                            inputProps={{ maxLength: 275 }}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <LogoFont
                            text='Home page image'
                            fontColor={theme.black}
                            fontWeight={500}
                            fontMargin="10px 0px 0px 0px"
                            fontType="secondary"
                        />
                        </AccordionSummary>
                        <AccordionDetails style={{display: 'flex', flexDirection: 'column'}}>
                            <Box style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                {file ? (
                                    <img src={URL.createObjectURL(file)} style={{ width: '250px' }} alt="Preview" />
                                ) : (
                                    <img src={'https://firebasestorage.googleapis.com/v0/b/dance-and--movement-workshop.appspot.com/o/hero.png?alt=media&token=198aa677-c6bd-4a75-aae9-0d49a6330646'} alt="Girl in a dance pose" style={{ width: '250px' }} />
                                )}
                            </Box>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                style={{ marginTop: '10px' }} 
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <LogoFont
                                text='Site colors'
                                fontColor={theme.black}
                                fontWeight={500}
                                fontMargin="10px 0px 0px 0px"
                                fontType="secondary"
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px 0', flexWrap: isMobile && 'wrap' }}>
                                {colors.map((color, index) => (
                                    <Box key={color.id} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flex: 1}}>
                                        <Box 
                                            onClick={() => toggleColorPicker(index)} 
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                backgroundColor: color.Hex, 
                                                cursor: 'pointer' 
                                            }} 
                                        />
                                        <LogoFont
                                            text={color.Color}
                                            fontColor={theme.black}
                                            fontMargin="0 0 0 10px"
                                            fontType="secondary"
                                        />
                                    </Box>
                                ))}
                            </Box>
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px 0'}}>
                                {colors.map((color, index) => (
                                    <Box key={color.id} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flex: 1}}>
                                        {activeColorIndex === index && (
                                            <SketchPicker
                                                color={color.Hex}
                                                onChangeComplete={(color) => handleColorChange(color, index)}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <LogoFont
                                text='Social Media Links'
                                fontColor={theme.black}
                                fontWeight={500}
                                fontMargin="10px 0px 0px 0px"
                                fontType="secondary"
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            {socials.map((social) => (
                                <Box key={social.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleSocialChange(social.id, e.target.checked)}
                                                checked={social.Active}
                                                sx={{
                                                    color: theme.secondary,
                                                    '&.Mui-checked': {
                                                        color: theme.primary,
                                                    },
                                                }}
                                            />
                                        }
                                        
                                    />
                                    <TextField
                                        value={social.Link}
                                        label={social.Name}
                                        focused
                                        onChange={(e) => handleURLChange(social.id, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginLeft: '10px', width: '100%' }}
                                        color="error"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: theme.primary, 
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.primary, 
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.primary, 
                                                },
                                            },
                                        }}
                                    />

                                </Box>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                    sx={{ 
                        mt: 3, 
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
            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                severity={snackbarSeverity} 
            />
        </Box>
    );
}

export default GeneralSettings;
