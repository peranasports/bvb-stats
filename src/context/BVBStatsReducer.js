const BVBStatsReducer = (state, action) => {
  switch (action.type) {
    case "GET_PLAYERS":
      return {
        ...state,
        players: action.payload,
        loading: false,
      };
    case "GET_MATCHES_FOR_PLAYER":
      return {
        ...state,
        matches: action.payload.matches,
        loading: false,
      };
    case "GET_TEAMS":
      return {
        ...state,
        teams: action.payload,
        loading: false,
      };
    case "GET_MATCHES_FOR_TEAM":
      return {
        ...state,
        matches: action.payload.matches,
        loading: false,
      };
    case "POST_MATCH":
      return {
        ...state,
        loading: false,
      };
    case "UPDATE_MATCH_VIDEO_OFFSET":
      return {
        ...state,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "CLEAR_PLAYERS_SEARCH":
      return {
        ...state,
        players: [],
      };
    case "CLEAR_TEAMS_SEARCH":
      return {
        ...state,
        teams: [],
      };
    default:
      return state;
  }
};

export default BVBStatsReducer;
