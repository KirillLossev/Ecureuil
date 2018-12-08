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
	// Put n into a reduced residue class.
	n = n % modulus;
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

// Returns true iff n is a square mod p, for p a prime greater than 2.
// (BigInt, BigInt) -> boolean
export function isSquare(n, p) {
	// If n is a multiple of p, then it is trivially a square as it is congruent to 0 mod p.
	if (n % p === 0n) {
		return true;
	}
	return pow(n, (p - 1n) / 2n, p) === 1n;
}

// Uses the Tonelli-Shanks algorithm to "unsquare" n mod p. 
// This algorithm works for any prime, but to save time this function will
// only be called if p !≡ 3 mod 4 and p !≡ 5 mod 8 as otherwise there
// are faster methods.
// It is assumed that n is in fact a non-zero quadratic residue mod p.
// (BigInt, BigInt) -> BigInt
function tonelliShanks(n, p) {
	// Step 1: Find s and odd q such that p-1 = q2^s
	var q = p - 1n;
	var s = 0n;
	while (q % 2n === 0n) {
		q /= 2n;
		s += 1n;
	}
	// Step 2: Find a non-square z mod p.
	var z = 2n; // 0 and 1 are always squares
	for (; isSquare(z, p); z++) {}
	// Step 3: Initialise loop variables
	var m = s;
	var c = pow(z, q, p);
	var t = pow(n, q, p);
	var r = pow(n, (q + 1n) / 2n, p);
	// Step 4: Loop
	while (t !== 1n) {
		// Find i, 0 < i < m such that t^(2^i) ≡ 1
		var k = t;
		var i = 1n
		for (; pow(k, 2n, p) !== 1n && i < m; i++) {
			k = repeatedSquare(k, 1n, p);
		}
		// By the assumption, there will be such an i. If not, throw an error.
		if (i >= m) {
			throw "n is not a quadratic residue mod p";
		}
		var b = repeatedSquare(c, m-i-1n, p);
		m = i;
		c = pow(b, 2n, p);
		t = (t * pow(b, 2n, p)) % p;
		r = (r * b) % p;
	}
	// Step 5: Now, r is an unsquare of n.
	return r;
}

// Returns a list containing reduced residues a such that a^2 ≡ n mod p, for p a prime greater than 2.
// (BigInt, BigInt) -> Set<BigInt>
export function unsquare(n, p) {
	// If n is a multiple of p then 0 is the only unsquare.
	if (n % p === 0n) {
		return new Set([0n]);
	} else if (!isSquare(n, p)) {
	// If n is not a square mod p, there are no unsquares.
		return new Set();
	}
	var firstRoot;
	// At this point, we know n is not a multiple of p and it is a square. From Lagrange,
	if (p % 4n === 3n){
		firstRoot = pow(n, (p + 1n) / 4n, p);
	// If this is not the case, Legendre gives another chance to easily find unsquares
	} else if (p % 8n === 5n) {
		firstRoot = pow(n, (p + 3n) / 8n, p);
		// If n is not a quartic residue there is another factor
		if (pow(n, (p - 1n) / 4n, p) !== 1n) {
			firstRoot = (firstRoot * pow(2, (p - 1n) / 4n, p)) % p;
		} 
	// Otherwise there is no general formula for the unsquares. Use the Tonelli-Shanks algorithm to find them.
	} else {
		firstRoot = tonelliShanks(n, p);
	}
	// The other root is -firstRoot. 
	var secondRoot = (p - firstRoot) % p;
	return new Set([firstRoot, secondRoot]);
}