import test  from 'tape';

import { abs, multInverse } from '../../lib/number_theory.mjs';

test('absolute value test', function (t){
	t.equal(abs(5n), 5n);

	t.equal(abs(BigInt(-5)), 5n);

	t.equal(abs(0n), 0n);

	t.end();
});

test('multiplicative inverse test', function (t){
	// Same integer, inverse should not exist
	t.equal(multInverse(5n, 5n), null);

	// Integers with common factors, inverse should not exist
	t.equal(multInverse(4n, 6n), null);

	// Relatively prime integers, inverse should exist and be computed correctly
	t.equal(multInverse(4n, 15n), 4n);

	// Relatively prime integers, negative n. Inverse should exist, be computed correctly, and be in a reduced residue class.
	t.equal(multInverse(BigInt(-4), 15n), 11n);

	// Relatively prime integers, negative modulus. Inverse should exist, be computed correctly, and be in a reduced residue class.
	t.equal(multInverse(4n, BigInt(-15)), 4n);

	// Relatively prime integers, both negative. Inverse should exist, be computed correctly, and be in a reduced residue class.
	t.equal(multInverse(BigInt(-4), BigInt(-15)), 11n);

	// Relatively prime integers, |n| > |modulus|
	t.equal(multInverse(19n, 15n), 4n);

	// Relatively prime integers, negative n, |n| > |modulus|
	t.equal(multInverse(BigInt(-19), 15n), 11n);

	// Relatively prime integers, negative modulus, |n| > |modulus|
	t.equal(multInverse(19n, BigInt(-15)), 4n);

	// Relatively prime integers, both negative, |n| > |modulus|
	t.equal(multInverse(BigInt(-19), BigInt(-15)), 11n);

	t.end();
});