/* eslint-disable no-plusplus */
import Question from '../models/question_model';
import Answer from '../models/answer_model';

export async function createQuestion(questionFields, query, user) {
  // await creating a question
  const question = new Question();
  question.title = questionFields.title;
  question.description = questionFields.description;
  question.options = questionFields.options;
  question.categories = questionFields.categories;
  // return question
  try {
    const savedQuestion = await question.save();
    return savedQuestion;
  } catch (error) {
    throw new Error(`create question error: ${error}`);
  }
}
export async function getQuestions(query) {
  if ('q' in query) {
    const questions = await Question.find({
      $or: [{ title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
        { categories: { $in: [query.q] } },
        { options: { $in: [query.q] } },
      ],
    });
    return questions;
  } else if ('c' in query) {
    const questions = await Question.find({ categories: { $in: [query.c] } });
    return questions;
  }
  // return all questions, sorted by answer count
  const sortedQuestions = await Answer
    .aggregate([
      {
        $group: {
          _id: '$question',
          answerCount: { $sum: 1 },
        },
      },
      { $sort: { answerCount: -1 } },
    ]);

  const allQuestions = await Question.find({}).lean();
  const a = sortedQuestions.concat(allQuestions).concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id.equals(a[j]._id)) {
        a[j].answerCount = a[i].answerCount;
        a[i] = a[j];
        a.splice(j--, 1);
      }
    }
  }
  return a;
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
