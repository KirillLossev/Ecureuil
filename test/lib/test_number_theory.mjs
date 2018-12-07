import test  from 'tape';

import { abs, multInverse, pow, isSquare } from '../../lib/number_theory.mjs';

test('absolute value test', function (t) {
	t.equal(abs(5n), 5n, "abs positive integer");

	t.equal(abs(BigInt(-5)), 5n, "abs negative integer");

	t.equal(abs(0n), 0n, "abs(0n)");

	t.end();
});

test('multiplicative inverse test', function (t) {
	t.equal(multInverse(5n, 5n), null, "same integer");

	t.equal(multInverse(4n, 6n), null, "integers with common factors");

	t.equal(multInverse(4n, 15n), 4n, "relatively prime integers");

	t.equal(multInverse(BigInt(-4), 15n), 11n, "relatively prime integers, negative n.");

	t.equal(multInverse(4n, BigInt(-15)), 4n, "relatively prime integers, negative modulus.");

	t.equal(multInverse(BigInt(-4), BigInt(-15)), 11n, "relatively prime integers, both negative.");

	t.equal(multInverse(19n, 15n), 4n, "relatively prime integers, |n| > |modulus|");

	t.equal(multInverse(BigInt(-19), 15n), 11n, "relatively prime integers, negative n, |n| > |modulus|");

	t.equal(multInverse(19n, BigInt(-15)), 4n, "relatively prime integers, negative modulus, |n| > |modulus|");

	t.equal(multInverse(BigInt(-19), BigInt(-15)), 11n, "relatively prime integers, both negative, |n| > |modulus|");

	t.end();
});

test('power test', function (t) {
	t.equal(pow(3n, 2n, 20n), 9n, "no modulus needed");

	t.equal(pow(3n, 0n, 20n), 1n, "exponent 0");

	t.equal(pow(3n, 2n, 5n), 4n, "modulus needed at end");

	t.equal(pow(5n, 4n, 12n), 1n, "modulus needed in intermediate calculations");

	t.equal(pow(5n, 5n, 12n), 5n, "exponent which is not power of 2");

	t.equal(pow(15n, 4n, 12n), 9n, "n > modulus");

	t.equal(pow(3n, BigInt(-1), 10n), null, "negative exponent");

	t.end();
});

test('is square test', function (t) {
	t.equal(isSquare(1n, 5n), true, "1 is always a square");

	t.equal(isSquare(5n, 13n), false, "5 is not a square mod 13");

	t.equal(isSquare(3n, 13n), true, "4^2 is 3 mod 13");

	t.end();
});