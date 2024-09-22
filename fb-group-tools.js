// ==UserScript==
// @name         Facebook Group Admin Tools
// @namespace    http://tampermonkey.net/
// @version      2024-09-21
// @description  Some admin tools to make my life on Facebook easier.
// @author       Douglas Muth - http://www.dmuth.org/contact
// @match        https://www.facebook.com/groups/*
// @grant        none
// ==/UserScript==
/**
*
* Find this script on the web: https://github.com/dmuth/facebook-javascript-toolbox
*
* To use this script in Tampermonkey, go into Tampermonkey, create a new script, and paste this code in.
*/


(function() {
    'use strict';

    console.log("##### Starting Tampermonkey Script");

    /**
    * Sleep for a short interval.
    */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
    * Get an element by a string contained
    */
    async function getByText(tag, strings) {

        let interval = 100;

        if (typeof strings === 'string') {
            strings = [strings];
        }

        let xpath = "";
        let xpath_fragment = "";
        for (let string of strings) {
            if (!xpath_fragment) {
                xpath_fragment = `contains(text(), '${string}')`;
            } else {
                xpath_fragment = `${xpath_fragment} or contains(text(), '${string}')`;
            }
        }

        console.log("XPATH Fragment", xpath_fragment);

        xpath = `//${tag}[${xpath_fragment}]`;
        console.log(`Searching xpath "${xpath}" for string "${strings}"...`);
        let retval = null;

        // Loop until the element is found
        while (!retval) {
            retval = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (retval) {
                console.log(`Element found! - Tag: ${tag}, string: ${strings}`);
                //console.log("DEBUG", retval); // Clicking on this in the browser console will highlight the element on the page.
                return(retval);
            }

            console.log(`Element not found, sleeping for ${interval}ms..`);
            await sleep(interval);
        }
    }

    // Core function for button creation
    function createButtonCore(text, left, cb) {

        let fontSize = 16;
        let width = text.length * 10;
        console.log(`Set button width to ${width} pixels for text "${text}".`);

        let button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = `${left}px`;
        button.style.height = '50px';  // Set the height to 100px
        button.style.width = '${width}px';   // Optionally set the width
        button.style.zIndex = '1000'; // Ensure the button is on top of other elements
        button.style.fontSize = `${fontSize}px`; // Make the font bigger (e.g., 24px)
        document.body.appendChild(button);

        button.addEventListener('click', cb);

    } // End of createButtonCore()


    /**
    * Click "actions" and then click "Give feedback".
    */
    async function giveFeedback() {

        document.querySelector('div[aria-label*="Actions for this post"]').click();
        console.log("Clicked Actions Button");

        let element = await getByText("span", "feedback");
        element.click();
        console.log("Clicked feedback button");

    }

    /**
    * Click "actions" and then click "report post".
    */
    async function reportPost() {

        document.querySelector('div[aria-label*="Actions for this post"]').click();
        console.log("Clicked Actions Button");

        let element = await getByText("span", "Report post");
        element.click();
        console.log("Clicked report post button");

    }

    /**
    * Toggle the ability to leave comments.
    * First click is to turn them off, next click is to turn them back on.
    */
    async function commentsToggle() {

        document.querySelector('div[aria-label*="Actions for this post"]').click();
        console.log("Clicked Actions Button");

        let element = await getByText("span", ["Turn off commenting", "Turn on commenting"]);
        element.click();
        console.log("Toggled comments on/off");

    }


    /**
    * Toggle the ability to leave comments.
    * First click is to turn them off, next click is to turn them back on.
    */
    async function postApprovalToggle() {

        document.querySelector('div[aria-label*="Actions for this post"]').click();
        console.log("Clicked Actions Button");

        let element = await getByText("span", ["Turn on post approval", "Turn off post approval"]);
        element.click();
        console.log("Toggled post approval on/off");

    }


    // Create a button and append it to the page
    function createButton() {

        createButtonCore("Give Feedback", 50, giveFeedback);
        createButtonCore("Report Post to Admins", 200, reportPost);
        createButtonCore("Toggle Comments", 400, commentsToggle);
        createButtonCore("Toggle Post Approval", 575, postApprovalToggle);

    }

    // Run this function to create the button when the page loads
    window.addEventListener('load', createButton);

    //    window.go = () => { console.log("DEBUG IN GO"); }


    console.log("##### Finished Tampermonkey Script");


})();
