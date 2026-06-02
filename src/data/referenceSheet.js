/*
 * AP Computer Science A — Java Quick Reference
 * Matches the official College Board reference sheet distributed during the exam.
 */

export const referenceSheet = [
  {
    section: 'String Methods',
    items: [
      { sig: 'int length()', desc: 'Returns the number of characters in this String.' },
      { sig: 'String substring(int from, int to)', desc: 'Returns a substring from index from (inclusive) to to (exclusive).' },
      { sig: 'String substring(int from)', desc: 'Returns substring(from, length()).' },
      { sig: 'int indexOf(String str)', desc: 'Returns the index of the first occurrence of str; −1 if not found.' },
      { sig: 'boolean equals(Object other)', desc: 'Returns true if this String is equal to other.' },
      { sig: 'int compareTo(String other)', desc: 'Returns a negative value if less, zero if equal, positive if greater.' },
      { sig: 'String toUpperCase()', desc: 'Returns this String with all letters converted to uppercase.' },
      { sig: 'String toLowerCase()', desc: 'Returns this String with all letters converted to lowercase.' },
      { sig: 'char charAt(int index)', desc: 'Returns the character at the specified index.' },
    ]
  },
  {
    section: 'Integer Methods / Values',
    items: [
      { sig: 'static int parseInt(String s)', desc: 'Returns the integer value represented by the String s.' },
      { sig: 'Integer.MIN_VALUE', desc: 'The minimum value representable by an int (−2^31, approximately −2.1 × 10^9).' },
      { sig: 'Integer.MAX_VALUE', desc: 'The maximum value representable by an int (2^31 − 1, approximately 2.1 × 10^9).' },
    ]
  },
  {
    section: 'Double Methods',
    items: [
      { sig: 'static double parseDouble(String s)', desc: 'Returns the double value represented by the String s.' },
    ]
  },
  {
    section: 'Math Methods',
    items: [
      { sig: 'static int abs(int x)', desc: 'Returns the absolute value of an int.' },
      { sig: 'static double abs(double x)', desc: 'Returns the absolute value of a double.' },
      { sig: 'static double pow(double base, double exp)', desc: 'Returns the value of base raised to the power exp.' },
      { sig: 'static double sqrt(double x)', desc: 'Returns the positive square root of x.' },
      { sig: 'static double random()', desc: 'Returns a double in the range [0.0, 1.0).' },
    ]
  },
  {
    section: 'ArrayList<E>  (java.util.ArrayList)',
    items: [
      { sig: 'int size()', desc: 'Returns the number of elements.' },
      { sig: 'boolean add(E obj)', desc: 'Appends obj to the end; always returns true.' },
      { sig: 'void add(int index, E obj)', desc: 'Inserts obj at index, shifting elements right.' },
      { sig: 'E get(int index)', desc: 'Returns the element at index.' },
      { sig: 'E set(int index, E obj)', desc: 'Replaces the element at index with obj; returns old element.' },
      { sig: 'E remove(int index)', desc: 'Removes and returns the element at index; shifts elements left.' },
    ]
  },
  {
    section: 'Object Methods (all classes inherit these)',
    items: [
      { sig: 'String toString()', desc: 'Returns a string representation of the object.' },
      { sig: 'boolean equals(Object other)', desc: 'Indicates whether some other object is "equal to" this one.' },
    ]
  },
];
