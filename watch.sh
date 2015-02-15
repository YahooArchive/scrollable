#!/bin/bash

# make sure you `npm install -g watchify` and `npm install`

watchify -t reactify js/main.js --debug -o build/bundle.js -v --debug