import { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoFont from '../components/LogoFont';
import BlogCard from '../components/BlogCard';

function BlogScreen() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);

  useEffect(() => {
    const fetchPostsAndCategories = async () => {
      const postsCollection = collection(db, 'BlogPosts');
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      postsList.sort((a, b) => b.PostDate.seconds - a.PostDate.seconds);
      setPosts(postsList);
      const categoriesSet = new Set(postsList.map(post => post.PostCategory));
      setCategories(['All', ...Array.from(categoriesSet)]);
    };

    fetchPostsAndCategories();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.PostCategory === selectedCategory);

  return (
    <Box 
      style={{
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        width: isMobile ? '100vw' : 'calc(100vw - 32px)', 
        height: '100vh', 
        overflow: 'hidden', 
        zIndex: 2, 
        margin: isMobile ? '80px 0px 0px 0px' : '80px 16px 16px 16px' 
      }}
    >
      <Box style={{display: 'flex', flexDirection: 'column', flex: !isMobile && 1, margin: '16px'}}>
        <Accordion defaultExpanded={!isMobile}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <LogoFont
              text="Categories"
              fontColor={theme.black}
              fontWeight={400}
              fontAlign="center" 
              fontMargin="0px 0px 10px 0px"
              fontSize='20px'
            />
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category, index) => (
                <FormControlLabel 
                  key={index} 
                  value={category} 
                  control={<Radio style={{ color: category === selectedCategory ? theme.primary : undefined }} />} 
                  label={category} 
                  style={{ color: category === selectedCategory ? theme.primary : undefined }}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box style={{display: 'flex', flexDirection: 'column', flex: 3, overflow: 'scroll'}}>
        <Box 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: isMobile ? 'center' : 'space-around', 
          }}
        >
          {filteredPosts.map((post) => (
            <Box 
              key={post.id} 
              style={{ 
                flex: isMobile ? '1 1 100%' : '1 1 calc(33.33% - 16px)', 
                margin: '8px', 
                maxWidth: isMobile ? '100%' : 'calc(33.33% - 16px)' 
              }}
            >
              <BlogCard post={post} onClick={() => handleCardClick(post)} />
            </Box>
          ))}
          {selectedPost && (
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>{selectedPost.PostTitle}</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1">{selectedPost.PostAuthor} | {new Date(selectedPost.PostDate.seconds * 1000).toLocaleDateString()}</Typography>
                <img src={selectedPost.PostImage} alt={selectedPost.PostTitle} style={{ width: '100%', marginBottom: '16px' }} />
                <Typography variant="body1">{selectedPost.PostContent}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default BlogScreen;
