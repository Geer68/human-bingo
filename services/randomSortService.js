export async function selectQuestions(eventData) {
  const { size, randomQuestions, sponsorQuestions } = eventData;
  const totalQuestionsSize = size * size;

  let selectedQuestions = [...sponsorQuestions];

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

  return selectedQuestions;
}
