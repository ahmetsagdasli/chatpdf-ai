// A simple set of common English stop words.
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
  'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at',
  'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on',
  'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'tell', 'me', 'about', 'can', 'you'
]);

/**
 * Splits a long text into smaller, overlapping chunks.
 * @param text The source text.
 * @param chunkSize The maximum size of each chunk (in words).
 * @param overlap The number of words to overlap between chunks.
 * @returns An array of text chunks.
 */
const chunkText = (text: string, chunkSize: number = 512, overlap: number = 128): string[] => {
  const words = text.split(/\s+/);
  if (words.length <= chunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
};

/**
 * Finds the most relevant text chunks from a document based on a query.
 * Uses an intelligent scoring mechanism based on term frequency and keyword coverage.
 * @param documentContent The entire content of the document.
 * @param query The user's question.
 * @returns A string containing the concatenated content of the most relevant chunks.
 */
export const getRelevantChunks = (documentContent: string, query: string): string => {
  const chunks = chunkText(documentContent);

  if (chunks.length <= 1) {
    return documentContent;
  }

  // Pre-process the query to get unique, meaningful keywords.
  const queryKeywords = Array.from(new Set(
    query
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 0 && !STOP_WORDS.has(word))
  ));

  if (queryKeywords.length === 0) {
    // Fallback for queries with only stop words or no words.
    return chunks.slice(0, 2).join('\n\n---\n\n');
  }

  const scoredChunks = chunks.map(chunk => {
    const lowerChunk = chunk.toLowerCase();
    let score = 0;
    let foundKeywordsCount = 0;

    queryKeywords.forEach(keyword => {
      // Use a regex to count whole-word occurrences to avoid partial matches (e.g., 'rag' in 'scraping').
      try {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerChunk.match(regex);
        const termFrequency = matches ? matches.length : 0;
  
        if (termFrequency > 0) {
          score += termFrequency; // Add term frequency to score
          foundKeywordsCount++;
        }
      } catch (e) {
        // Ignore regex errors for malformed keywords
      }
    });

    // Add a significant bonus for keyword coverage. Chunks that contain more unique keywords are much more relevant.
    // The bonus is quadratic to heavily favor better coverage.
    if (foundKeywordsCount > 0) {
        score += (foundKeywordsCount * foundKeywordsCount) * 10;
    }

    return { chunk, score };
  });

  // Sort chunks by the calculated score in descending order.
  scoredChunks.sort((a, b) => b.score - a.score);

  // Filter out chunks with a score of 0 and take the top N (e.g., 4) chunks.
  const topChunks = scoredChunks.filter(c => c.score > 0).slice(0, 4);

  // If no chunks match at all, provide the first couple of chunks as a fallback context.
  if (topChunks.length === 0) {
    return chunks.slice(0, 2).join('\n\n---\n\n');
  }

  return topChunks.map(c => c.chunk).join('\n\n---\n\n');
};
