Travis-CI: [![Build Status](https://travis-ci.org/KirillLossev/Ecureuil.svg?branch=master)](https://travis-ci.org/KirillLossev/Ecureuil)

---

# Écureuil
An elliptic curve calculator for demonstrating commutations with elliptic curves.

## Running
Note that this code relies on `BigInt`s which are not currently available in all browsers. See [`caniuse`](https://caniuse.com/#feat=bigint) for current availability.  

Use of ES6 modules is required as well, which are supported on up-to-date versions of major browsers. See [`caniuse`](https://caniuse.com/#feat=es6-module) for current availability.

## Testing
This project uses [tape](https://github.com/substack/tape) (which requires Node.js) for testing. This means that NodeJS >=11.x is required.

The tests can be run with

`node --experimental-modules test/*/*.mjs`
