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
export function multInverse(n, modulus){
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
	}else {
		return null;
	}
}