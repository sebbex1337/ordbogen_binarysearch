# ORDBOGEN

This is a poorly implemented - read: deliberately slow - backend for a dictionary-service.

It is intended to work with data from The Danish Dictionary (**Den Danske Ordbog**),
specifically the Full-form list. See details at https://korpus.dsl.dk/resources/details/ddo-fullforms.html.

It is a simple REST server with only a single endpoint https://localhost:8080/ordbogen/:index where ``index`` is the numbered entry in the dictionary - all entries are in alphabetical order by their *inflected form*, but can only be accessed by their index. A request takes approximately 100ms to complete.

This is a deliberate *bad design choice* - the server has no practical use, beyond being an exercise playground for practicing algorithms on the frontend.

## Installation

If you haven't already - fork or clone this repository.

**Download data**

You need to download the Full-form list yourself, accept the terms of use, and add it to the ```data/```-folder. 

Download the **DDO full-form** file from https://korpus.dsl.dk/resources/licences/dsl-open.html - unzip it, rename the extracted file to ```ddo_fullforms.csv``` and place it in the ```/data/``` folder

**Initialise modules**

Run ```npm install``` to install the required dependencies (cors and rexpress).

**Run the application**

Start the server with `npm start` - it uses port 8080 by default, but this can be changed in the main.js source.

## Usage

Use plain GET requests to access the server.

`GET /ordbogen` will return a JSON structure with the minimum and maximum indexes that the server understands. E.g.:

    {
      "min": 0,
      "max": 666080
    }

`GET /ordbogen/:index` where index is a number between `min` and `max` (both included) will return a JSON structure for that particular entry in the dictionary. E.g. `GET /ordbogen/101808` will return:

    {
      "inflected": "datamatiker",
      "headword": "datamatiker",
      "homograph": "",
      "partofspeech": "sb.",
      "id": "11008444"
    }

The entries are sorted alphabetically by the `inflected` form, meaning that 101807 will be the same headword, but the inflected form *datamatik* and 101809 will also be the same headword, but now the inflected form *datamatikere*.

If you try to access and index outside of the `min` and `max` values, the service will return a 404.