import { requireNativeComponent, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";

var viewPropTypes = {
  name: "Web3Provider",
  propTypes: {
    DAPP_URL: PropTypes.string,
    CHAIN_ID: PropTypes.number,
    RPC_URL: PropTypes.string,
    PRIVATE_KEY: PropTypes.string,
    ...ViewPropTypes,
  },
};

module.exports = requireNativeComponent("Web3Provider", viewPropTypes);
