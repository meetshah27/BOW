// Test file to verify date fix
import { parseDateString, formatDate, toDateInputString } from './dateUtils';

// Test cases
const testCases = [
  '2024-12-12', // December 12th
  '2024-01-01', // January 1st
  '2024-06-15', // June 15th
];

console.log('=== Date Fix Test ===');
testCases.forEach(dateStr => {
  const parsed = parseDateString(dateStr);
  const formatted = formatDate(dateStr, 'long');
  const inputString = toDateInputString(parsed);
  
  console.log(`Original: ${dateStr}`);
  console.log(`Parsed: ${parsed}`);
  console.log(`Formatted: ${formatted}`);
  console.log(`Input String: ${inputString}`);
  console.log('---');
});

// Test the specific issue (12th showing as 11th)
const testDate = '2024-12-12';
const oldWay = new Date(testDate);
const newWay = parseDateString(testDate);

console.log('=== Specific Issue Test ===');
console.log(`Date: ${testDate}`);
console.log(`Old way (new Date): ${oldWay.toDateString()}`);
console.log(`New way (parseDateString): ${newWay.toDateString()}`);
console.log(`Old way day: ${oldWay.getDate()}`);
console.log(`New way day: ${newWay.getDate()}`); 