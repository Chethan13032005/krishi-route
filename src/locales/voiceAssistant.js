// Localized Audio Guidance Prompts
const prompts = require('./voicePrompts.json');

function getVoicePrompt(promptKey) {
  return prompts[promptKey] || '';
}

module.exports = { getVoicePrompt };
