//whole wallet array
const key = new Int8Array(64);
export const walletDatashema = {
  name: "Wallet_array",
  // properties: {
  //   walletList: { type: "list", objectType: "intObject" },
  // },
  properties: {
    walletname: "string",
    walletType: "string",
    mnemonic: "string",
    type: "string",
    selected: "string",
    uniqueKey: "string",
    wallets: { type: "list", objectType: "walletarr" }

  },
  encryptionKey: key,
};
export const intObject = {
  name: "intObject",
  properties: {
    walletname: "string",
    walletType: "string",
    mnemonic: "string",
    type: "string",
    selected: "string",
    wallets: { type: "list", objectType: "walletarr" }

  },
  encryptionKey: key,
};

export const walletarr = {
  name: "walletarr",
  properties: {
    currency: "string",
    path: "string",
    privKey: "string",
    pubKey: "string",
    walletaddress: "string",
    currencyName: "string",
    contractAddress: "string",
    tokenType: "string",
    currencyimage: "string"
  },
  encryptionKey: key,
}

export const tokenArr = {
  name: "Token_array",
  properties: {
    uniqueKey: "string",
    Tokens: { type: "list", objectType: "subToken" }
  },
  encryptionKey: key
}

export const rememberMe = {
  name: "rememberMe",
  properties: {
    mailAddress: "string",
    password: "string"
  }
}

export const subToken = {
  name: "subToken",
  properties: {
    tokenType: "string",
    currencySymbol: "string",
    contractAddress: "string",
    currencyimage: "string"
  },
  encryptionKey: key
}


//for maintain user passcode status
export const userPasscodeValue = {
  name: "userPasscodeValue",
  properties: {
    passcode: { type: "string" },
  },
  encryptionKey: key,
};

//for maintain user biometric status
export const userBiometricStatus = {
  name: "userBiometricStatus",
  properties: {
    userBiometricStatus: { type: "string" },
  },
  encryptionKey: key,
};

//for save push notification status
export const pushNotificationStatus = {
  name: "pushNotificationStatus",
  properties: {
    notificationStatus: { type: "string" },
  },
  encryptionKey: key,
};

//for save dappAppStatus
export const dappAppStatus = {
  name: "dappAppStatus",
  properties: {
    dappAppStatus: { type: "string" },
  },
  encryptionKey: key,
};

//for save default currency
export const defaultCurrency = {
  name: "defaultCurrency",
  properties: {
    defaultCurrency: { type: "string" },
  },
  encryptionKey: key,
};

//for retrieve emoji,gif,stickers
export const keyboardRetrieval = {
  name: "keyboardRetrieval",
  properties: {
    emojiArr: { type: "list", objectType: "emojiObj" },
    gifArr: { type: "list", objectType: "gifObj" },
    stickerArr: { type: "list", objectType: "stickerObj" }
  },
  encryptionKey: key,
};

export const emojiObj = {
  name: "emojiObj",
  properties: {
    char: { type: "string" },
  },
  encryptionKey: key,
};

export const gifObj = {
  name: "gifObj",
  properties: {
    gifs: { type: "string" },
  },
  encryptionKey: key,
};

export const stickerObj = {
  name: "stickerObj",
  properties: {
    stickers: { type: "string" },
  },
  encryptionKey: key,
};


export const loginStatus = {
  name: "loginStatus",
  properties: {
    logIn: { type: "string" },
    mail: { type: "string" }
  },
  encryptionKey: key,
}

export const keyboardSpecs = {
  name: "keyboardSpecs",
  properties: {
    Dapp: { type: "string" },
    translate: { type: "string" },
    wallet: { type: "string" },
    language: { type: "string" },
    Themes: { type: "string" },
    voice: { type: "string" },
    capsLetter: { type: "string" },
    wordPrediction: { type: "string" },
  },
  encryptionKey: key,
}

export const WC = {
  name: "WC",
  properties: {
    WC: {
      type: "string"
    },
  },
  encryptionKey: key
}

export const dappTabs = {
  name: "dappTabs",
  properties: {
    TabId: { type: "string" },
    ImageUrl: { type: "string" },
    TAB: { type: "list", objectType: "Tabsobj" }
  },
  encryptionKey: key
}

export const recentlyClosed = {
  name: "recentlyClosed",
  properties: {
    URL: "string",
    hostName: "string",
    id: "string"
  },
  encryptionKey: key
}


export const Tabsobj = {
  name: "Tabsobj",
  properties: {
    URL: "string",
    hostName: "string",
    id: "string"
  },
  encryptionKey: key
}

export const RssReadLater = {
  name: "RssReadLater",
  properties: {
    ImageUrl: "string",
    RssTitle: "string",
    parsedDescription: "string",
    domainName: "string",
    publishedAt: "string",
    RssUrl: "string"
  },
  encryptionKey: key
}