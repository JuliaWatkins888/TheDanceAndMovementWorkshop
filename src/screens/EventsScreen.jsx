import { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, CardActionArea, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LogoFont from '../components/LogoFont';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'Events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const getModifiedEmbedCode = (embedCode) => {
    const width = isMobile ? '100%' : '900px';
    const height = isMobile ? '5000px' : '3500px';

    return embedCode.replace(/width="\d+"/, `width="${width}"`).replace(/height="\d+"/, `height="${height}"`);
  };

  const getPrice = (promoEndDate, earlyBirdFee, standardFee) => {
    const currentDate = new Date();
    const promoEnd = promoEndDate ? new Date(promoEndDate) : null;

    if (!promoEndDate || !earlyBirdFee || currentDate > promoEnd) {
        return standardFee;
    } else {
        return earlyBirdFee;
    }
};

const getPayLink = (promoEndDate, payLink, promoPayLink) => {
    const currentDate = new Date();
    const promoEnd = promoEndDate ? new Date(promoEndDate) : null;

    return !promoEndDate || !promoPayLink || currentDate > promoEnd ? payLink : promoPayLink;
};

const getEmbedCode = (promoEndDate, embedCode, promoEmbedCode) => {
    const currentDate = new Date();
    const promoEnd = promoEndDate ? new Date(promoEndDate) : null;

    return !promoEndDate || !promoEmbedCode || currentDate > promoEnd ? embedCode : promoEmbedCode;
};

  function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() + 1).padStart(2, '0'); 
    return `${month}-${day}-${year}`;
}

  return (
    <Box style={{ display: 'flex', width: isMobile ? '100vw' : 'calc(100vw - 32px)', height: '100vh', zIndex: 2, margin: isMobile ? '80px 0px 0px 0px' : '80px 16px 16px 16px', overflow: 'scroll' }}>
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'space-around', width: '100%' }}>
        {events.map((event) => (
          <Card key={event.id} style={{ margin: '16px', flex: isMobile ? '1 1 100%' : '1 1 calc(33.33% - 32px)', maxWidth: isMobile ? '100%' : 'calc(33.33% - 32px)', position: 'relative' }}>
            
              <CardContent style={{ padding: '16px' }}>
                <LogoFont
                  text={event.Name}
                  fontColor={theme.black}
                  fontWeight={400}
                  fontMargin="0px 0px 10px 0px"
                  fontSize='18px'
                  fontType="secondary"
                />
                <LogoFont
                  text={`$${getPrice(event.PromoEndDate, event.EarlyBirdFee, event.StandardFee)}`}
                  fontColor={theme.primary}
                  fontWeight={400}
                  fontMargin="0px 0px 10px 0px"
                  fontSize='28px'
                  fontType="secondary"
                />
                <Box style={{ position: 'relative', overflow: 'hidden', marginBottom: '16px', marginRight: '-16px' }}>
                  <img src={event.Image} style={{ width: '100%', borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px' }} alt={event.Name} />
                  <Typography
                  variant="subtitle2"
                  style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: theme.primary,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                  }}
                  >
                    {'Ages ' + event.AgeRestriction}
                  </Typography>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '8px'}}>
                  <CalendarMonthIcon style={{marginRight: '8px', color: theme.primary}} />
                  <Typography variant="body2">{`${formatDateForDisplay(event.StartDate)} - ${formatDateForDisplay(event.EndDate)}`}</Typography>
                </Box>
                <Typography variant="body2">{event.Description}</Typography>
                <Button variant="contained" onClick={() => handleCardClick(event)} sx={{ 
                  backgroundColor: theme.primary,
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  '&:hover': {
                      backgroundColor: theme.secondary,
                  },
                }}>
                  Sign Up
                </Button>
              </CardContent>
          </Card>
        ))}
        {selectedEvent && (
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
            <DialogTitle style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedEvent.Name}
              <Button variant="contained" href={getPayLink(selectedEvent.PromoEndDate, selectedEvent.PayLink, selectedEvent.PromoPayLink)} target="_blank" rel="noopener noreferrer" sx={{ 
                backgroundColor: theme.primary,
                '&:hover': {
                    backgroundColor: theme.secondary,
                },
              }}>
                {isMobile ? 'Buy' : 'Pay for Event'}
              </Button>
            </DialogTitle>
            <Divider />
            <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
              <Box dangerouslySetInnerHTML={{ __html: getModifiedEmbedCode(getEmbedCode(selectedEvent.PromoEndDate, selectedEvent.EmbedCode, selectedEvent.PromoEmbedCode)) }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}

export default EventsScreen;
