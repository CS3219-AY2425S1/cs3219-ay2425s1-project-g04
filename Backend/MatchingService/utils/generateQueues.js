// Used to generate all possible combinations of criteria for matching
/*
  Order matters:
  Example:
    - First criteria is the difficulty
    - Second criteria is the language
    - Combinations are [easy, python], ... , [hard, cplusplus]
    - Queue names are easy.python, ... , hard.cplusplus
  If you switch the order of the criteria, the combinations will be reversed!
  Example:
    - Combinations become [python, easy], ... , [cplusplus, hard]
    - Queue names become python.easy, ... , cplusplus.hard

  Functions can be used with other criteria like difficulty, topic, etc.
  These functions can be chained multiple times to generate routing criteria longer than 2
 */

function generateCombinations(criteria1, criteria2) {
  const combinations = [];
  for (let i = 0; i < criteria1.length; i++) {
    for (let j = 0; j < criteria2.length; j++) {
      combinations.push([criteria1[i], criteria2[j]]);
    }
  }
  return combinations;
}

// output string is based on order of fields in the combinations array
function generateQueueNames(combinations) {
  const queueNames = [];
  for (const combination of combinations) {
    const queueName = `${combination[0]}.${combination[1]}`;
    queueNames.push(queueName);
  }
  return queueNames;
}

module.exports = { generateCombinations, generateQueueNames };