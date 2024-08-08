import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../firebaseConfig';
import { Box, Button, TextField, CardMedia, FormControl, FormControlLabel, RadioGroup, Radio, CircularProgress } from '@mui/material';

function BlogForm({ setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, setEditedPost, editedPost, imageInputType, setImageInputType, onSubmit }) {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({}); // State to store validation errors

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost((prev) => ({ ...prev, [name]: value }));

        // Clear error for the field when user starts typing
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleImageInputChange = (e) => {
        setImageInputType(e.target.value);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`Blog/${file.name}`);
            setIsUploading(true); 
            
            try {
                await imageRef.put(file);
                const imageUrl = await imageRef.getDownloadURL();
                setEditedPost((prev) => ({ ...prev, PostImage: imageUrl }));
                setSnackbarMessage("Image uploaded successfully!");
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage("Error uploading image!");
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
                setIsUploading(false); 
            }
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!editedPost.PostTitle) tempErrors.PostTitle = "Title is required";
        if (!editedPost.PostContent) tempErrors.PostContent = "Content is required";
        if (!editedPost.PostCategory) tempErrors.PostCategory = "Category is required";
        if (!editedPost.PostAuthor) tempErrors.PostAuthor = "Author is required";
        if (!editedPost.PostImage) tempErrors.PostImage = "Image is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit();
        } else {
            setSnackbarMessage("Please fill in all fields");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box>
            <CardMedia
                component="img"
                height="140"
                image={editedPost.PostImage}
                alt={editedPost.PostTitle}
            />
            <FormControl component="fieldset">
                <RadioGroup row value={imageInputType} onChange={handleImageInputChange}>
                    <FormControlLabel value="url" control={<Radio />} label="Image URL" />
                    <FormControlLabel value="upload" control={<Radio />} label="Upload Image" />
                </RadioGroup>
            </FormControl>

            {isUploading ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {imageInputType === 'url' ? (
                        <TextField
                            margin="dense"
                            name="PostImage"
                            label="Image URL"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedPost.PostImage}
                            onChange={handleInputChange}
                            error={!!errors.PostImage}
                            helperText={errors.PostImage}
                        />
                    ) : (
                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload">
                                <Button variant="contained" component="span" sx={{ 
                                    mb: 2,
                                    mt: 2,
                                }}>
                                    Upload Image
                                </Button>
                            </label>
                        </Box>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        name="PostTitle"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editedPost.PostTitle}
                        onChange={handleInputChange}
                        error={!!errors.PostTitle}
                        helperText={errors.PostTitle}
                    />
                    <Box style={{display: 'flex', flexDirection: 'row'}}>
                        <TextField
                            margin="dense"
                            name="PostCategory"
                            label="Category"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedPost.PostCategory}
                            onChange={handleInputChange}
                            style={{marginRight: '16px'}}
                            error={!!errors.PostCategory}
                            helperText={errors.PostCategory}
                        />
                        <TextField
                            margin="dense"
                            name="PostAuthor"
                            label="Author"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedPost.PostAuthor}
                            onChange={handleInputChange}
                            error={!!errors.PostAuthor}
                            helperText={errors.PostAuthor}
                        />
                    </Box>
                    <TextField
                        margin="dense"
                        name="PostContent"
                        label="Content"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={editedPost.PostContent}
                        onChange={handleInputChange}
                        error={!!errors.PostContent}
                        helperText={errors.PostContent}
                    />
                </>
            )}
        </Box>
    );
}

export default BlogForm;
