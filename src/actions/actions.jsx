export const setThemeColors = (colors) => ({
  type: 'SET_THEME_COLORS',
  payload: colors,
});
export const setSocials = (state) => ({
  type: 'SET_SOCIALS',
  payload: state,
});
export const setPages = (state) => ({
  type: 'SET_PAGES',
  payload: state,
});
export const setMobile = (state) => ({
  type: 'SET_MOBILE',
  payload: state,
});
export const setNavEnter = (state) => ({
  type: 'SET_NAV_ENTER',
  payload: state,
});
export const setOpenNav = (state) => ({
  type: 'SET_OPEN_NAV',
  payload: state,
});
export const setScrollPosition = (state) => ({
  type: 'SET_SCROLL_POSITION',
  payload: state,
});
export const setActiveScreen = (state) => ({
  type: 'SET_ACTIVE_SCREEN',
  payload: state,
});
export const setLoggedIn = (state) => ({
  type: 'SET_IS_LOGGED_IN',
  payload: state,
});
export const setActiveUser = (state) => ({
  type: 'SET_ACTIVE_USER',
  payload: state,
});
export const setActivePagesCount = (count) => ({
  type: 'SET_ACTIVE_PAGES_COUNT',
  payload: count,
});