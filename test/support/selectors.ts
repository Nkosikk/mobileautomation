export function textSelector(text: string): string {
  if (driver.isAndroid) {
    const escapedText = text.replaceAll('"', '\\"');
    return `android=new UiSelector().text("${escapedText}")`;
  }

  const escapedText = text.replaceAll("'", "\\'");
  return `-ios predicate string:label == '${escapedText}'`;
}
