import Answer from '../models/answer_model';

export async function createAnswer(answerFields, query, user) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }

  // await creating a answer
  const answer = new Answer();
  answer.user = user;
  answer.question = answerFields.question;

  // return answer
  try {
    const savedAnswer = await answer.save();
    return savedAnswer;
  } catch (error) {
    throw new Error(`create answer error: ${error}`);
  }
}
export async function getAnswers(query) {
  if ('search_term' in query) {
    const answers = await Answer.find({ $text: { $search: query.search_term } }, '-title -options')
      .lean().sort({ createdAt: -1 });
    return answers;
  }
  // return all answers
  const answers = await Answer.find({}, '-title -options')
    .lean().sort({ createdAt: -1 });
  return answers;
}

export async function getAnswer(id) {
  // await finding one answer
  const answer = await Answer.findById(id).lean();
  // return answer
  if (!answer) {
    throw new Error('answer not found');
  }
  return answer;
}
export async function deleteAnswer(id, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  // await deleting a answer
  await Answer.findByIdAndDelete(id);
  // return confirmation
  return { msg: `answer ${id} deleted successfully.` };
}
