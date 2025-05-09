import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, setDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Box, Button, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, CardMedia, FormControl, FormControlLabel, RadioGroup, Radio, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoFont from '../components/LogoFont';
import BlogCard from './BlogCard';
import CloseIcon from '@mui/icons-material/Close';
import BlogForm from './BlogForm';

function BlogSettings() {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const theme = useSelector((state) => state.theme);
    const isMobile = useSelector((state) => state.isMobile);
    const [posts, setPosts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editedPost, setEditedPost] = useState({ PostTitle: '', PostContent: '', PostCategory: '', PostAuthor: '', PostImage: '', PostDate: ''});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [imageInputType, setImageInputType] = useState('url'); 

    useEffect(() => {
        const fetchPosts = async () => {
            const postsSnapshot = await getDocs(collection(db, 'BlogPosts'));
            const postData = [];
            postsSnapshot.forEach((doc) => {
                postData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postData);
        };

        fetchPosts();
    }, [snackbarOpen]);

    const handleCardClick = (post) => {
        setSelectedPost(post);
        setEditedPost({ id: post.id, PostTitle: post.PostTitle, PostContent: post.PostContent, PostCategory: post.PostCategory, PostAuthor: post.PostAuthor, PostImage: post.PostImage, PostDate: post.PostDate});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPost(null);
        setEditedPost({ PostTitle: '', PostContent: '', PostCategory: '', PostAuthor: '', PostImage: '', PostDate: ''});
        setImageInputType('url');
    };

    const handleSaveChanges = async () => {
        if (editedPost.PostTitle && editedPost.PostContent && editedPost.PostCategory && editedPost.PostAuthor && editedPost.PostImage) {
            const updatedPost = { ...editedPost };
            const postRef = doc(db, 'BlogPosts', editedPost.id);
            try {
                await setDoc(postRef, updatedPost);
                setSnackbarMessage("Post updated successfully!");
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage("Error updating post!");
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
                handleCloseDialog();
            }
        } else {
            setSnackbarMessage("Please fill in all fields");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeletePost = async () => {
        try {
            await deleteDoc(doc(db, "BlogPosts", editedPost.id));
            setSnackbarMessage("Post deleted successfully!");
            setSnackbarSeverity('success');
            handleCloseDialog();
        } catch (error) {
            setSnackbarMessage("Error deleting post!");
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleNewPost = async () => {
        if (editedPost.PostTitle && editedPost.PostContent && editedPost.PostCategory && editedPost.PostAuthor && editedPost.PostImage) {
            const newPost = { ...editedPost, PostDate: Timestamp.fromDate(new Date()) };
            try {
                await setDoc(doc(collection(db, 'BlogPosts')), newPost);
                setSnackbarMessage("New post created successfully!");
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage("Error creating new post!");
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
                handleCloseDialog();
            }
        } else {
            setSnackbarMessage("Please fill in all fields");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {console.log(editedPost)}, [editedPost])

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', margin: isMobile ? '16px 0px 0px 0px' : '16px 0px 0px 16px', padding: '10px' }}>
            <LogoFont
                text='Blog'
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
                    {isMobile ? (
                        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {posts.length > 0 && posts.map((post) => (
                                <Box key={post.id} style={{ width: '100%', padding: '16px 0px', borderBottom: '1px solid #eaeaea', flexDirection: 'column' }} onClick={() => handleCardClick(post)}>
                                    {post.PostTitle}
                                    <Box style={{display: 'flex', flexDirection: 'row'}}><span style={{color: theme.primary, marginRight: '5px'}}>{post.PostAuthor}</span> | {new Date(post.PostDate.seconds * 1000).toLocaleDateString()}</Box>
                                </Box>
                            ))}    
                        </Box>
                    ) : (<Box style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {posts.length > 0 && posts.map((post) => (
                            <Box key={post.id} style={{ flex: '1 1 calc(33.333% - 16px)', boxSizing: 'border-box' }}>
                                <BlogCard post={post} onClick={() => handleCardClick(post)} />
                            </Box>
                        ))}
                    </Box>)}
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <LogoFont
                        text='Add New'
                        fontColor={theme.black}
                        fontWeight={500}
                        fontMargin="10px 0px 0px 0px"
                        fontType="secondary"
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <BlogForm imageInputType={imageInputType} setImageInputType={setImageInputType} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} setSnackbarSeverity={setSnackbarSeverity} editedPost={editedPost} setEditedPost={setEditedPost} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleNewPost}
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
                </AccordionDetails>
            </Accordion>
            {selectedPost && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={!isMobile && 'xl'}> 
                    <Box style={{minWidth: isMobile ? '90vw' : '75vw'}}>
                        <DialogTitle>
                            Edit Post
                            <CloseIcon style={{position: 'absolute', right: '16px', top: '16px', cursor: 'pointer'}} onClick={handleCloseDialog} />
                        </DialogTitle>
                        <DialogContent>
                            <BlogForm imageInputType={imageInputType} setImageInputType={setImageInputType} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} setSnackbarSeverity={setSnackbarSeverity} editedPost={editedPost} setEditedPost={setEditedPost} />
                        </DialogContent>
                        <DialogActions>
                            <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, padding: '0px 16px'}}>
                                <Box style={{display: 'flex', flexDirection: 'column', flex: 1, margin: '0px 10px 0px 0px'}}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={handleDeletePost}
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
                        </DialogActions>
                    </Box>
                </Dialog>
            )}
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

export default BlogSettings;
