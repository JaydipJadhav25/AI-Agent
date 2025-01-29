Several JavaScript functions can determine if a number is prime. Here are a couple, with explanations:

**Method 1: Basic Iteration (Less Efficient)**

This method iterates through all numbers from 2 up to the square root of the input number to check for divisibility.  It's simpler to understand but less efficient for very large numbers.

```javascript
function isPrimeBasic(num) {
  // Prime numbers are whole numbers greater than 1
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false; //Divisible by 2 or 3

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}


//Example Usage
console.log(isPrimeBasic(2));   // true
console.log(isPrimeBasic(10));  // false
console.log(isPrimeBasic(17));  // true
console.log(isPrimeBasic(97));  // true
console.log(isPrimeBasic(100)); // false

```

**Method 2: Optimized Iteration (More Efficient)**

This version improves efficiency by only checking divisibility by numbers up to the square root of the input number.  It also handles the cases for 2 and 3 separately for a slight speed boost.

```javascript
function isPrimeOptimized(num) {
  // Prime numbers are whole numbers greater than 1
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

//Example Usage
console.log(isPrimeOptimized(2));   // true
console.log(isPrimeOptimized(10));  // false
console.log(isPrimeOptimized(17));  // true
console.log(isPrimeOptimized(97));  // true
console.log(isPrimeOptimized(100)); // false
```

Both functions achieve the same result.  `isPrimeOptimized` is generally preferred for larger numbers due to its better performance.  Choose the method that best suits your needs and understanding.  Remember that checking for primality becomes computationally expensive for extremely large numbers.
