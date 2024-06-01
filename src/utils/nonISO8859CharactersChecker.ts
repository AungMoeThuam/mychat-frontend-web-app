export default function nonISO8859CharactersChecker(inputString: any) {
  for (let i = 0; i < inputString.length; i++) {
    const code = inputString.charCodeAt(i);
    if (code > 255) {
      return true; // Non-ISO-8859-1 character found
    }
  }
  return false; // No non-ISO-8859-1 characters found
}
