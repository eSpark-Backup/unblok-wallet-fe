const initialState = {
  Connected : false,
  Session:null,
  page:null,
  type:null,
  payload:null,
  uri:null,
  WC_Connector:null,
  StopAction:false,
  Loader:false,
  time:null,
  Type_Emit:null,
  topic:null,
  Address:null,
  chain:null,
  topic:null,
  from:null,
  Site_Detail:null,
  All_Session:null,
  current_session:null
};

const wcreducer = (state = initialState, action) => {
  // console.log("action", { ...state, ...action.data })
  switch (action.type) {
    case "Connect":
      return { ...state, ...{ ['Connected']: action.data } }
    case "page":
      return { ...state, ...action.data }
    case "Session":
      return { ...state, ...action.data }
    case "initial":
      return initialState
    default:
      return state;
  }
};

export default wcreducer;
