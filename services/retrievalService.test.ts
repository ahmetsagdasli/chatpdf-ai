import { describe, expect, it } from 'vitest';
import { chunkText, getRelevantChunks } from './retrievalService';

describe('chunkText', () => {
  it('returns the whole text as a single chunk when it fits within chunkSize', () => {
    const text = 'one two three four five';
    expect(chunkText(text, 10, 2)).toEqual([text]);
  });

  it('splits long text into overlapping chunks of the requested size', () => {
    const words = Array.from({ length: 20 }, (_, i) => `w${i}`);
    const text = words.join(' ');

    const chunks = chunkText(text, 10, 4);

    // step = chunkSize - overlap = 6, so chunks start at 0, 6, 12, 18
    expect(chunks).toHaveLength(4);
    expect(chunks[0].split(' ')).toEqual(words.slice(0, 10));
    expect(chunks[1].split(' ')).toEqual(words.slice(6, 16));
    // consecutive chunks overlap on the shared words
    expect(chunks[0].split(' ').slice(-4)).toEqual(chunks[1].split(' ').slice(0, 4));
  });

  it('uses the default chunkSize/overlap when not provided', () => {
    const words = Array.from({ length: 600 }, (_, i) => `word${i}`);
    const chunks = chunkText(words.join(' '));
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe('getRelevantChunks', () => {
  it('returns the full document unchanged when it only produces a single chunk', () => {
    const doc = 'short document about cats and dogs';
    expect(getRelevantChunks(doc, 'what is this about?')).toBe(doc);
  });

  it('ranks chunks containing more query keywords higher', () => {
    const chunkA = Array.from({ length: 300 }, () => 'alpha').join(' ');
    const chunkB = `${Array.from({ length: 298 }, () => 'beta').join(' ')} rocket engine`;
    const doc = `${chunkA} ${chunkB}`;

    const result = getRelevantChunks(doc, 'rocket engine');

    expect(result).toContain('rocket engine');
  });

  it('falls back to the first chunks when the query has only stop words', () => {
    const chunkA = Array.from({ length: 300 }, () => 'alpha').join(' ');
    const chunkB = Array.from({ length: 300 }, () => 'beta').join(' ');
    const doc = `${chunkA} ${chunkB}`;

    const result = getRelevantChunks(doc, 'the and of');

    expect(result.length).toBeGreaterThan(0);
  });

  it('falls back to the first chunks when no keyword matches any chunk', () => {
    const chunkA = Array.from({ length: 300 }, () => 'alpha').join(' ');
    const chunkB = Array.from({ length: 300 }, () => 'beta').join(' ');
    const doc = `${chunkA} ${chunkB}`;

    const result = getRelevantChunks(doc, 'nonexistentword zzzqqq');

    expect(result).toContain('alpha');
  });

  it('matches whole words only, not substrings', () => {
    const chunkA = `${Array.from({ length: 298 }, () => 'alpha').join(' ')} scraping data`;
    const chunkB = `${Array.from({ length: 298 }, () => 'beta').join(' ')} rag pipeline`;
    const doc = `${chunkA} ${chunkB}`;

    // "rag" should match chunkB's standalone word "rag", not the "rag" inside "scraping"
    const result = getRelevantChunks(doc, 'rag');

    expect(result).toContain('rag pipeline');
  });
});
