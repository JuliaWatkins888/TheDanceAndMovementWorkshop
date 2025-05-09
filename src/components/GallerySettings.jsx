import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, setDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Box, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogContent, Snackbar, TextField, Button, CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoFont from '../components/LogoFont';

function GallerySettings() {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const [gallery, setGallery] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [uploading, setUploading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newCaption, setNewCaption] = useState('');

    useEffect(() => {
        const fetchGallery = async () => {
            const gallerySnapshot = await getDocs(collection(db, 'Gallery'));
            const galleryData = [];
            gallerySnapshot.forEach((doc) => {
                galleryData.push({ id: doc.id, ...doc.data() });
            });
            setGallery(galleryData);
        };

        fetchGallery();
    }, [snackbarOpen]);
    
    const getPlaceholderItems = () => {
        const placeholders = [];
        const remainder = gallery.length % 4;
        if (remainder !== 0) {
            for (let i = 0; i < 4 - remainder; i++) {
                placeholders.push(<Box key={`placeholder-${i}`} style={{ flex: '1 0 calc(25% - 10px)', marginBottom: '10px', visibility: 'hidden' }} />);
            }
        }
        return placeholders;
    };

    const handleOpen = (image) => {
      setSelectedImage(image);
      setIsOpen(true);
    };
    
    const handleClose = () => {
      setIsOpen(false);
      setSelectedImage(null);
    };

    const handleCloseDialog = () => {
        setSelectedImage(null);
    };
    
    const handleSaveChanges = async () => {
        if (selectedImage && selectedImage.Caption.trim() !== '') {
            try {
                await setDoc(doc(db, "Gallery", selectedImage.id), { ...selectedImage });
                setSnackbarMessage("Gallery image updated successfully!");
                setSnackbarSeverity('success');
                handleClose();
            } catch (error) {
                setSnackbarMessage("Error updating gallery image!");
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
            }
        } else {
            setSnackbarMessage("Caption cannot be empty!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteGallery = async (x) => {
      try {
          await deleteDoc(doc(db, "Gallery", x));
          setSnackbarMessage("Gallery image deleted successfully!");
          setSnackbarSeverity('success');
          handleCloseDialog();
          setIsOpen(false);
      } catch (error) {
          setSnackbarMessage("Error deleting Gallery Image!");
          setSnackbarSeverity('error');
      } finally {
          setSnackbarOpen(true);
      }
    }

    const handleSnackbarClose = () => {
       setSnackbarOpen(false);
    };
    
    const handleCaptionChange = (e) => {
        setSelectedImage({ ...selectedImage, Caption: e.target.value });
    };

    const handleNewCaptionChange = (e) => {
        setNewCaption(e.target.value);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!newImage || newCaption.trim() === '') {
            setSnackbarMessage("Image and caption cannot be empty!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setUploading(true);

        const storageRef = ref(storage, `Gallery/${newImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newImage);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Optional: handle progress
            },
            (error) => {
                setSnackbarMessage("Error uploading image!");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await addDoc(collection(db, 'Gallery'), {
                        Caption: newCaption,
                        URL: downloadURL
                    });
                    setSnackbarMessage("Image uploaded successfully!");
                    setSnackbarSeverity('success');
                    setNewImage(null);
                    setNewCaption('');
                } catch (error) {
                    setSnackbarMessage("Error saving image URL to database!");
                    setSnackbarSeverity('error');
                } finally {
                    setSnackbarOpen(true);
                    setUploading(false);
                }
            }
        );
    };
    
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', margin: isMobile? '0px' : '0px 0px 0px 16px', padding: '10px' }}>
            <LogoFont
                text='Gallery'
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
                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {gallery.length > 0 && gallery.map((image) => (
                            <Box key={image.id} onClick={() => handleOpen(image)} style={{ flex: '1 0 calc(25% - 10px)', marginBottom: '10px', cursor: 'pointer' }}>
                                <LazyLoadImage
                                    src={image.URL}
                                    alt={image.Caption}
                                    effect="blur"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </Box>
                        ))}
                        {getPlaceholderItems()}
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <LogoFont
                        text='Upload New'
                        fontColor={theme.black}
                        fontWeight={500}
                        fontMargin="10px 0px 0px 0px"
                        fontType="secondary"
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <TextField
                            label="Caption"
                            value={newCaption}
                            onChange={handleNewCaptionChange}
                            fullWidth
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            disabled={uploading}
                            sx={{ 
                                mb: 2,
                                backgroundColor: theme.primary,
                                '&:hover': {
                                    backgroundColor: theme.secondary,
                                },
                            }}
                        >
                            {uploading ? <CircularProgress size={24} /> : 'Upload'}
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth="xl"
            >
                <DialogContent>
                    {selectedImage && (
                        <Box style={{display: 'flex', flexDirection: 'column'}}>
                            <img src={selectedImage.URL} alt={selectedImage.Caption} style={{ height: isMobile ? 'auto' : 'calc(100vh - 164px)', width: isMobile && '100%', marginBottom: '16px' }}  />
                            <TextField
                                margin="dense"
                                name="PostImage"
                                label="Image URL"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedImage.Caption}
                                onChange={handleCaptionChange}
                                style={{marginBottom: '16px'}}
                                error={selectedImage.Caption.trim() === ''}
                                helperText={selectedImage.Caption.trim() === '' ? 'Caption cannot be empty!' : ''}
                            />
                            <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, padding: '0px 16px'}}>
                                <Box style={{display: 'flex', flexDirection: 'column', flex: 1, margin: '0px 10px 0px 0px'}}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={() => {handleDeleteGallery(selectedImage.id)}}
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
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={handleSaveChanges}
                                        sx={{ 
                                            mb: 2, 
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
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

export default GallerySettings;
