export class ContentModerator {
  moderateContent(text) {
    const patterns = {
      educational: /\b(explain|learn|understand|teach|how|what|why|concept|theory|formula|solve)\b/i,
      inappropriate: /\b(violence|hate|explicit)\b/i
    };

    const isEducational = patterns.educational.test(text);
    const isInappropriate = patterns.inappropriate.test(text);

    return {
      approved: isEducational && !isInappropriate,
      reason: isInappropriate ? 'Content flagged as inappropriate' : null
    };
  }
}
