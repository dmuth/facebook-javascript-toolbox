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
    async function getByText(tag, string) {

        let interval = 100;

        let xpath = `//${tag}[contains(text(), '${string}')]`;
        console.log(`Searching xpath ${xpath} for string ${string}...`);
        let retval = null;

        // Loop until the element is found
        while (!retval) {
            retval = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (retval) {
                console.log(`Element found! - Tag: ${tag}, string: ${string}`);
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
        console.log(`Set width to ${width} pixels.`);

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


    // Create a button and append it to the page
    function createButton() {

        createButtonCore("Give Feedback", 50, giveFeedback);
        createButtonCore("Report Post to Admins", 200, reportPost);

    }

    // Run this function to create the button when the page loads
    window.addEventListener('load', createButton);

//    window.go = () => { console.log("DEBUG IN GO"); }


    console.log("##### Finished Tampermonkey Script");


})();
