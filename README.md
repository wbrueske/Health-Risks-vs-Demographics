# Health-Risks-vs-Demographics
Interactive scatter plot of US health risks and demographics.

See the deployed app at https://wbrueske.github.io/Health-Risks-vs-Demographics/

![alt-text](https://raw.githubusercontent.com/wbrueske/Health-Risks-vs-Demographics/master/screenshots/HealthRisks.png "Scatter Plot Screenshot")
-

## How it Works
This was an exercise in D3.js with a dataset taken from the US Census Bureau.  D3 is used to read in the CSV and plot the data.  The interactive chart can have the X and Y axes set to various health risks and demographic factors by clicking on the labels.  The scatter plot markers and axes then animate and scale respectively into the new positions to reflect the newly selected health risk or demographic.

d3-tip.js was also employed so that hovering over any of the markers brings up the state's name and the specific values of the currently selected health risk and demographic.

![alt-text](https://raw.githubusercontent.com/wbrueske/Health-Risks-vs-Demographics/master/screenshots/tooltip-screenshot.png "Tooltip Screenshot")

## Languages & Libraries Used
 - JavaScript
 - D3.js
 - d3-tip.js
 - HTML
 - CSS
