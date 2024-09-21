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

async function go() { 

  document.querySelector('div[aria-label*="Actions for this post"]').click();
  console.log("Clicked Actions Button");

  let element = await getByText("span", "feedback");
  element.click();

}


