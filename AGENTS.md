## Application requirements

Write a bingo application with the following requirements.

* it **must** show a 5x5 bingo card
* it **must** accept horizontal, vertical and diagonal matches
* it **must** be possible to generate a new bingo card by clicking a button
* it **must** be possible to reset the current bingo card by clicking a button
* it **should** be possible to select and de-select a field
* state of the board **must** be persisted in the browser. A reload of the page **must* restore the previous state.
* all text displayed in the browser **must** be german. 
* code, comments and documentation **should** be in english

## Design requirements

* it **should** use corporate design from the equippers:
  * `#121212` as black, `#ffffff` as white, `#ed1566` as primary color
  * if needed `#fdd835` can be used as secondary color, but it should be avoided
  * "Poppins" as font
  * default `line-height:1.5` for paragraphs
* page **should** be in dark mode
* Bingo board **must** be readable in landscape and portrait mode. It **should** always be as large as the shorter of the two screen edges.
* Use `public/logo.svg` for the center field.

## Technical requirements

* There **must not** be any server-side code. The application **must** run completely in the browser.
* It **should** run in all current major browsers
* It **must** be friendly to touch devices and click devices. It **should** be responsive and work on touch screens.
* All assets **must** be hosted locally. No fonts or cookies from third-party sites.
* The application **should** not use cookies.
* There **must** be no tracking of user interactions.
* all assets **must** have a free and open source license. You **must not** use any assets that have no license.
  * When downloading assets, make sure the license is downloaded as well and is kept next to the used assets
