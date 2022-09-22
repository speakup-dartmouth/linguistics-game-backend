import Question from '../models/question_model';

export async function createQuestion(questionFields, query, user) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }

  // await creating a question
  const question = new Question();
  question.title = questionFields.title;
  question.description = questionFields.description;
  question.options = questionFields.options;

  // return question
  try {
    const savedQuestion = await question.save();
    return savedQuestion;
  } catch (error) {
    throw new Error(`create question error: ${error}`);
  }
}
export async function getQuestions(query) {
  if ('search_term' in query) {
    const questions = await Question.find({ $text: { $search: query.search_term } }, '-title -options')
      .lean().sort({ createdAt: -1 });
    return questions;
  }
  // return all questions
  const questions = await Question.find({}, '-title -options')
    .lean().sort({ createdAt: -1 });
  return questions;
}

export async function getQuestion(id) {
  // await finding one question
  const question = await Question.findById(id).lean();
  // return question
  if (!question) {
    throw new Error('question not found');
  }
  return question;
}
export async function deleteQuestion(id, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  // await deleting a question
  await Question.findByIdAndDelete(id);
  // return confirmation
  return { msg: `question ${id} deleted successfully.` };
}
