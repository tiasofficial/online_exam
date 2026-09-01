const crypto = require('crypto');

/**
 * Standardizes raw variables, equations, or concepts into a unified string signature.
 * Strips cosmetic whitespace, sorts parameters/formulas alphabetically, and creates a SHA-256 hash.
 */
function generateFingerprint(topic, subtopic, conceptText, formulaDependency = '') {
  const cleanTopic = String(topic).trim().toLowerCase();
  const cleanSubtopic = String(subtopic).trim().toLowerCase();
  
  // Strip common filler words, cosmetic names (e.g. "Object A", "Block B", "toluene", "benzene"), and numbers
  const cleanConcept = String(conceptText)
    .replace(/(object\s+[a-z]|block\s+[a-z]|particle\s+[a-z]|body\s+[a-z]|sphere\s+[a-z]|cylinder\s+[a-z]|car\s+[a-z])/gi, 'object')
    .replace(/(toluene|benzene|aniline)/gi, 'aromatic_species')
    .replace(/[0-9]+/g, '#') // Replace all numbers with placeholders to match identical mathematical structures
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();

  const cleanFormula = String(formulaDependency)
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();

  const payload = `${cleanTopic}:${cleanSubtopic}:${cleanConcept}:${cleanFormula}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Checks if a question with the same topic, subtopic, and concept fingerprint already exists.
 * Returns true if it is a duplicate.
 */
async function isDuplicateQuestion(model, topic, subtopic, conceptText, formulaDependency, representationType) {
  const fingerprint = generateFingerprint(topic, subtopic, conceptText, formulaDependency);
  
  const match = await model.findOne({
    topic,
    subtopic,
    concept_fingerprint: fingerprint,
    representation_type: representationType
  });
  
  return !!match;
}

module.exports = {
  generateFingerprint,
  isDuplicateQuestion
};
