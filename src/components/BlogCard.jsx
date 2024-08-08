import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoFont from '../components/LogoFont';

function BlogCard({ post, onClick }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  

  const getFirstSentence = (content) => {
    const match = content.match(/(.*?[.!?])\s/);
    return match ? match[0] : content;
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.PostCategory === selectedCategory);

  return (
    <Card 
        key={post.id} 
        style={{ 
        margin: '16px', 
        flex: '1 1 calc(33.333% - 32px)', 
        display: 'flex', 
        flexDirection: 'column', 
        cursor: 'pointer', 
        position: 'relative', 
        height: '400px',
        boxSizing: 'border-box'
        }} 
        onClick={() => onClick(post)}
    >
        <CardMedia
        component="img"
        height="140"
        image={post.PostImage}
        alt={post.PostTitle}
        />
        <Typography
        variant="subtitle2"
        style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: theme.primary,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
        }}
        >
        {post.PostCategory}
        </Typography>
        <CardContent>
        <LogoFont
            text={post.PostTitle}
            fontColor={theme.black}
            fontWeight={400}
            fontMargin="0px 0px 10px 0px"
            fontSize='18px'
            fontType="secondary"
        />
        <Typography variant="body2" color="text.secondary">
            {getFirstSentence(post.PostContent)}
        </Typography>
        <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '64px', display: 'flex', flexDirection: 'row', alignItems: 'center', borderTop: '1px solid #eaeaea', padding: '0px 10px' }}>
            <Typography variant="subtitle1" color="text.secondary">
            <span style={{ color: theme.primary }}>{post.PostAuthor}</span> | {new Date(post.PostDate.seconds * 1000).toLocaleDateString()}
            </Typography>
        </Box>
        </CardContent>
    </Card>
  );
}

export default BlogCard;
