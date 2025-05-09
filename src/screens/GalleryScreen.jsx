import { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { db } from '../firebaseConfig';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const activeScreen = useSelector((state) => state.activeScreen);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await db.collection('Gallery').get();
      const imagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesData);
    };
    fetchImages();
  }, []);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prevState) => ({ ...prevState, [id]: true }));
  };

  return (
    <Box style={{ display: 'flex', width: isMobile ? '100vw' : 'calc(100vw - 32px)', height: '100vh', zIndex: 2, margin: isMobile ? '80px 0px 0px 0px' : '80px 16px 16px 16px', overflow: 'scroll' }}>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 992: 2, 993: 4 }}
        style={{ width: '100%', height: isMobile ? 'calc(100vh - 74px)' : 'calc(100vh - 96px)', overflowX: 'scroll' }}
      >
        <Masonry gutter="16px">
          {images.map((image) => (
            <Box key={image.id} onClick={() => handleOpen(image)} style={{ cursor: 'pointer' }}>
              {!loadedImages[image.id] && (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
              <LazyLoadImage
                src={image.URL}
                alt={image.Caption}
                effect="blur"
                afterLoad={() => handleImageLoad(image.id)}
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth={!isMobile && "lg"}
      >
        <DialogContent>
          {selectedImage && (
            <>
              <img src={selectedImage.URL} alt={selectedImage.Caption} style={{ height: isMobile ? 'auto' : 'calc(100vh - 164px)', width: '100%', marginBottom: '16px' }} />
              <Typography variant="body1">
                {selectedImage.Caption}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default GalleryScreen;
