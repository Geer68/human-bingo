function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export async function selectQuestions(eventData) {
  const { size, randomQuestions, sponsorQuestions } = eventData;
  const totalQuestionsSize = size * size;

  let selectedQuestions = [...sponsorQuestions];

  shuffleArray(randomQuestions);

  const additionalQuestionsNeeded =
    totalQuestionsSize - selectedQuestions.length;

  if (additionalQuestionsNeeded > 0) {
    const randomQuestionsSize = randomQuestions.length;
    const randomQuestionsSelected = randomQuestions.slice(
      0,
      additionalQuestionsNeeded
    );

    selectedQuestions = [...selectedQuestions, ...randomQuestionsSelected];
  }

  shuffleArray(selectedQuestions);

  return selectedQuestions;
}
