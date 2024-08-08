const initialState = {
    isMobile: false,
    theme: {
        black: '#161515',
        white: '#F5F9FA',
        primary: '#ea154a',
        secondary: '#BF3F4D',
    },
    socials: [],
    pages: [],
    openNav: false,
    scrollPosition: 0,
    navEnter: false,
    activeScreen: null,
    isLoggedIn: false,
    activeUser: null,
    activePagesCount: 0,
};
 
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_THEME_COLORS':
          return {
            ...state,
            theme: action.payload,
          };    
        case 'SET_SOCIALS':
            return {
                ...state,
                socials: action.payload,
            };      
        case 'SET_PAGES':
            return {
                ...state,
                pages: action.payload,
            };  
        case 'SET_MOBILE':
            return {
                ...state,
                isMobile: action.payload,
            };
        case 'SET_NAV_ENTER':
            return {
                ...state,
                navEnter: action.payload,
            };
        case 'SET_OPEN_NAV':
            return {
                ...state,
                openNav: action.payload,
            };
        case 'SET_SCROLL_POSITION':
            return {
                ...state,
                scrollPosition: action.payload,
            };
        case 'SET_ACTIVE_SCREEN':
            return {
                ...state,
                activeScreen: action.payload,
            };
        case 'SET_IS_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: action.payload,
            };
        case 'SET_ACTIVE_USER':
            return {
                ...state,
                activeUser: action.payload,
            };
        case 'SET_ACTIVE_PAGES_COUNT':
            return {
                ...state,
                activePagesCount: action.payload,
            };
        default:
            return state;
    }
};

export default rootReducer;

  