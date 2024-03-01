import { ADD_SEED_DATA } from "../Actions/types";

const initialState = {
  seedData: [],
};

const seedDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SEED_DATA:
      return {
        ...state,
        seedData: action.data,
      };

    default:
      return state;
  }
};

export default seedDataReducer;
