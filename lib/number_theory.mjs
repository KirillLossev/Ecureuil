// Returns a positive BigInt with the same magnitude as the argument.
// (BigInt) -> BigInt
export function abs(n) {
	if (n < 0){
		return 0n - n;
	} else {
		return n;
	}
}

// Returns a positive integer k such that n*k≡1 modulo the modulus, or null if no such integer exists.
// This occurs if n and the modulus are not relatively prime.
// (BigInt, BigInt) -> BigInt
export function multInverse(n, modulus) {
	// Use the extended Euclidean algorithm to compute the gcd and inverse if it exists.
	var a = modulus;
	var b = n;
	var inverse_iterate_constant = 0n;
	var inverse_iterate_coeff    = 1n;
	while (b !== 0n){
		var t = b;
		var quotient = a / b;
		b = a % b;
		a = t;

		var inverse_iterate = inverse_iterate_constant - (quotient * inverse_iterate_coeff);
		inverse_iterate_constant = inverse_iterate_coeff;
		inverse_iterate_coeff = inverse_iterate;
	}
	// At this point, a is the gcd and, if it is 1, inverse_iterate_constant will be the inverse of n.
	if (a === 1n){
		return inverse_iterate_constant;
	// If it is -1, then the numbers are relatively prime but inverse_iterate_constant will be the negative of the inverse.
	// Keep the result in a reduced residue class.
	} else if (a === BigInt(-1)){
		return abs(modulus) - inverse_iterate_constant;
	} else {
		return null;
	}
}

// Computes n^(2^k) modulo the modulus.
// (BigInt, BigInt, BigInt) -> BigInt
function repeatedSquare(n, k, modulus) {
	var result = n;
	for (var i = 0n; i < k; i++) {
		result = (result ** 2n) % modulus;
	}
	return result;
}

// Computes n^k modulo the modulus, if k is non-negative.
// (BigInt, BigInt, BigInt) -> BigInt
export function pow(n, k, modulus) {
	// Forbid k < 0.
	if (k < 0){
		return null;
	}
	// Decompose k into a sum of powers of 2. Then n^k is the product of n raised to these powers of 2.
	// This requires finding the largest power of 2 less than k.
	var largestPower = 0n;
	while (2n ** largestPower < k) {
		largestPower++;
	}
	var result = 1n;
	for (var i = largestPower; i >= 0n; i--) {
		if (2n ** i <= k) {
			result = (result * repeatedSquare(n, i, modulus)) % modulus;
			k -= 2n ** i;
		}
	}
	return result;
}