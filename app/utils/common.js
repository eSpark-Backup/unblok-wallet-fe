import React from 'react'
import { AES, enc } from 'react-native-crypto-js';
import { ApiConstants } from '../api/ApiConstants';
import Web3 from 'web3'
import URL from 'url-parse';
import Clipboard from '@react-native-community/clipboard';
import Share from "react-native-share";

const web3 = new Web3();

export const EncodePrivateKey = (key) => {
    try {

        let bytes = AES.decrypt(key, ApiConstants.secretOrKey);
        return bytes.toString(enc.Utf8);
    } catch (error) {
        console.log("error on encode privatekey", error);
    }
};


export function getSignParamsMessage(params) {
    // const isValid = 
    // return isValid
    try {
        console.log("khdskajdsa", params, web3.utils.isAddress(params[1]))
        const message = params.filter((p) => !web3.utils.isAddress(p))[0];
        console.log("errr on message0", message);
        return convertHexToUtf8(message);
    } catch (error) {
        console.log("errror on getSignParamsMessage", error);
    }

}


export function convertHexToUtf8(value) {
    try {
        console.log("web3.utils.isHex(value)", web3.utils.isHex(value));
        if (web3.utils.isHex(value)) {
            return web3.utils.hexToUtf8(value);
        }

        return value;
    } catch (error) {
        console.log("erroor ", error);
    }

}

export const findHostNameWithUrl =  (uri) => {
    var findHost = new URL(uri)
    // console.log("findHost", findHost);
    return findHost
}


export const getMonthName = (monthNumber) => {
    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };
    return months[monthNumber] || "Invalid month number";
}

export function findCommonObjectsById(arr1, arr2) {

    return arr1?.filter(obj1 =>
        arr2?.some(obj2 =>
            obj1?.title === obj2?.hostName
        )
    );
}


export const copyToClipboard = (copyVal) => {
    Clipboard.setString(copyVal);
}

export const customShare = async (data) => {
    try {
        const shareOptions = {
            message: data,
        };
        await Share.open(shareOptions);
    } catch (error) {
        console.log("errur", error);
    }

}
export function parseHtmlString(str) {
	// Replace HTML entities with their corresponding characters
	str = str.replace(/&#([0-9]+);/g, (match, dec) => {
		if (dec === '160') {
			return '';
		}

		return String.fromCharCode(dec);
	});

	// Remove CSS and JavaScript
	str = str.replace(/<style([\s\S]*?)<\/style>|<script([\s\S]*?)<\/script>/gi, '');

	// Remove HTML tags
	str = str.replace(/(<([^>]+)>)/gi, '');

	// Remove extra whitespace and special characters
	str = str
		.replace(/\s+/g, ' ')
		.replace(/[\n\r]+/g, ' ')
		.replace(/(&nbsp;)/gi, '')
		.trim();

	// Replace special characters
	str = str.replace(/&quot;/g, '"');
	str = str.replace(/&amp;/g, '&');

	// Remove '[link]' and '[comments]' from description
	const linkRegex = /\[link]/g;
	const commentsRegex = /\[comments]/g;
	const emptyCommentsRegex = /Comments/g;
	str = str.replace(linkRegex, '').replace(commentsRegex, '').replace(emptyCommentsRegex, '');

	// Remove leading and trailing whitespace
	str = str.trim();

	return str;
}