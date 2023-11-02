import Answer from '../models/answer_model';
import * as Users from './user_controller';
import User from '../models/user_model';

export async function createAnswer(answerFields, user) {
  // await creating a answer
  const answer = new Answer();
  answer.user = user;
  answer.question = answerFields.question;
  answer.recordingURL = answerFields.recordingURL;
  answer.stance = answerFields.stance;
  answer.upvotes = [];
  answer.downvotes = [];

  // return answer
  try {
    const savedAnswer = await answer.save();
    return savedAnswer.populate({ path: 'user', select: 'username' });
  } catch (error) {
    throw new Error(`create answer error: ${error}`);
  }
}
export async function getAnswers(query, user) {
  if ('u' in query) {
    const answers = await Answer.find({ $or: [{ upvotes: { $in: [query.u] } }, { downvotes: { $in: [query.u] } }] })
      .lean().sort({ createdAt: -1 });
    return answers;
  }
  if ('question' in query) {
    const answers = await Answer.find({ question: query.question }).populate({ path: 'user', select: 'username' }).sort({ createdAt: -1 });
    const answersList = answers.map((answer) => { return { ...answer.toObject(), userVoteStatus: answer.getUserVoteStatus(user._id) }; });
    return answersList;
  }
  // return all answers
  const answers = await Answer.find({}).populate({ path: 'user', select: 'username' })
    .lean().sort({ createdAt: -1 });
  return answers;
}

export async function getAllAnswers() {
  try {
    const answers = await Answer.find();
    return answers;
  } catch (error) {
    throw new Error(`get all answers error ${error}`);
  }
}

export async function getAnswersForResearch(query) {
  const users = await Users.getUserIDs(query);
  const answers = await Answer.find({ user: { $in: users } }).sort({ createdAt: -1 });
  return answers;
}

export async function getAnswersForResearchManual(query) {
  const users = await Users.getUserIDsManual(query);
  const answers = await Answer.find({ user: { $in: users } }).sort({ createdAt: -1 });
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

export async function voteAnswer(id, query, user) {
  if (!query || !query.v) {
    throw new Error('missing valid query. usage: /answers/answerID/vote?v={-1,1}');
  }
  const answer = await Answer.findById(id);
  if (!answer) {
    throw new Error('answer not found');
  }

  const { v } = query;
  const vote = parseInt(v, 10);

  if (answer.user.equals(user._id)) {
    throw new Error('user cannot upvote own post');
  }

  let score = 0;

  if (vote === 1) {
    answer.downvotes = answer.downvotes.filter((item) => { return !(item.equals(user._id)); });
    const filtered = answer.upvotes.filter((a) => { return !a.equals(user._id); });
    if (filtered.length !== answer.upvotes.length) {
      answer.upvotes = filtered;
      score = -1;
    } else {
      answer.upvotes.push(user);
      score = 1;
    }
  } else if (vote === -1) {
    answer.upvotes = answer.upvotes.filter((item) => { return !(item.equals(user._id)); });
    const filtered = answer.downvotes.filter((a) => { return !a.equals(user._id); });
    if (filtered.length !== answer.downvotes.length) {
      answer.downvotes = filtered;
      score = 1;
    } else {
      answer.downvotes.push(user);
      score = -1;
    }
  }

  const answerResult = await Answer.findByIdAndUpdate(id, answer, { returnDocument: 'after' }).populate({ path: 'user', select: 'username' });

  // increment upvotes counter as simple integer
  const scoreStatus = await Users.updateScore(answer.user, score);
  if (!scoreStatus || !scoreStatus.msg) {
    throw new Error('error updating score');
  }
  console.log(`score status: ${scoreStatus.msg}`);

  return { ...answerResult.toObject(), userVoteStatus: answerResult.getUserVoteStatus(user._id) };
}

export async function deleteAnswer(id) {
  // await deleting a answer
  await Answer.findByIdAndDelete(id);
  // return confirmation
  return { msg: `answer ${id} deleted successfully.` };
}
