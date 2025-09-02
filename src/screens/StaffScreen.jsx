import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoFont from '../components/LogoFont';

function StaffScreen() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [hoveredId, setHoveredId] = useState(null); // track which member is hovered
  const isMobile = useSelector((state) => state.isMobile);
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchStaff = async () => {
      const staffCollection = collection(db, 'StaffMembers');
      const staffSnapshot = await getDocs(staffCollection);
      const staffList = staffSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      staffList.sort((a, b) => a.StaffMemberOrder - b.StaffMemberOrder);
      setStaffMembers(staffList);
    };

    fetchStaff();
  }, []);

  return (
    <Box
      style={{
        display: 'flex',
        width: 'calc(100vw - 32px)',
        height: '100vh',
        zIndex: 2,
        margin: isMobile ? '80px 16px 0px 16px' : '80px 16px 16px 16px',
        flexDirection: 'column',
        overflow: 'scroll',
      }}
    >
    <LogoFont
        text="We're pleased to meet you!"
        fontColor={theme.black}
        fontWeight={700}
        fontAlign="center"
        fontMargin={isMobile ? "0px 0px 20px 0px" : "20px 0px 30px 0px"}
        fontType="secondary"
        fontSize={!isMobile && '23px'}
    />
    <Box style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: isMobile ? '80%' : '100%',
        justifyContent: 'space-between',
        margin: isMobile && 'auto'
    }}>
      {staffMembers.map((member) => (
        <Box
          key={member.id}
          onMouseEnter={() => setHoveredId(member.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            position: 'relative',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            width: isMobile ? '100%' : 'calc(25% - 16px)',
            height: '600px',
            marginBottom: '16px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <Box style={{ flexGrow: 1, overflow: 'hidden' }}>
            <img
              src={member.StaffMemberImage || '/placeholder.jpg'}
              alt={member.StaffMemberName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s',
                transform:
                  hoveredId === member.id ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </Box>
          <Box style={{ padding: '12px' }}>
            <LogoFont
              text={member.StaffMemberName}
              fontColor={theme.black}
              fontWeight={500}
              fontMargin="0 0 4px 0"
              fontType="secondary"
            />
            <Typography
              variant="subtitle2"
              style={{
                color: theme.black,
                fontSize: '0.9rem',
                fontWeight: 400,
              }}
            >
              {member.StaffMemberTitle}
            </Typography>
          </Box>

          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 'calc(100% - 32px)',
              height: '100%',
              backgroundColor:
                hoveredId === member.id ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '16px',
              transition: 'background-color 0.3s, opacity 0.3s',
              opacity: hoveredId === member.id ? 1 : 0,
            }}
          >
            <Typography
              variant={isMobile ? 'subtitle1' : "h6"}
              style={{ marginBottom: '8px', fontWeight: 'bold' }}
            >
              {member.StaffMemberName}
            </Typography>
            <Typography variant={isMobile ? 'caption' : "subtitle1"} style={{ marginBottom: '8px' }}>
              {member.StaffMemberTitle}
            </Typography>
            <Typography variant={isMobile ? 'caption' : "body2"}>{member.StaffMemberBio}</Typography>
          </Box>
        </Box>
      ))}
      </Box>
    </Box>
  );
}

export default StaffScreen;
