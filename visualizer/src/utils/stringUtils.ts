/**
 * Extracts the title and description from a line of text
 * @param text Line of text in format "title: description"
 */
export function splitTitleAndDescription(text: string): [string, string | undefined] {
  const [title, ...descParts] = text.split(': ');
  const description = descParts.join(': '); // Handle cases where description contains colons
  return [title.trim(), description?.trim()];
}

/**
 * Counts the level of indentation based on | and - characters
 * @param line Input line from the mindmap text
 */
export function countIndentation(line: string): number {
  const match = line.match(/^(\||-)+/);
  if (!match) return 0;
  
  const indentation = match[0];
  // Count each '|' or '-' as one level
  return indentation.length;
}

/**
 * Removes indentation characters from a line
 * @param line Input line from the mindmap text
 */
export function cleanLine(line: string): string {
  return line.replace(/^(\||-)+/, '').trim();
}