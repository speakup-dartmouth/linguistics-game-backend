import Answer from '../models/answer_model';

export async function createAnswer(answerFields) {
  // await creating a answer
  const answer = new Answer();
  answer.user = answerFields.user;
  answer.question = answerFields.question;
  answer.recordingURL = answerFields.recordingURL;
  answer.upvotes = 0;
  answer.downvotes = 0;

  // return answer
  try {
    const savedAnswer = await answer.save();
    return savedAnswer;
  } catch (error) {
    throw new Error(`create answer error: ${error}`);
  }
}
export async function getAnswers(query) {
  if('u' in query) {
    const answers = await Answer.find({ $or:[ { upvotes : { $in : [query['u']] }}, { downvotes : { $in : [query['u']] }}]})
      .lean().sort({ createdAt: -1 });
    return answers;
  }
  // return all answers
  const answers = await Answer.find({})
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

export async function voteAnswer(id, query, fields) {
    if(!query || !query.v) {
      throw new Error('missing valid query. usage: /answers/answerID/vote?v={-1,1}');
    }
    const answer = await Answer.findById(id).lean();
    if (!answer) {
      throw new Error('answer not found');
    }
    const { user } = fields;
    const { v } = query;

    if(user == answer.user) {
      throw new Error('user cannot upvote own post');
    }

    if(v == 1) {
      answer.downvotes = answer.downvotes.filter(item => !(item.equals(user)));
      const filtered = answer.upvotes.filter(v => !v.equals(user));
      if (filtered.length != answer.upvotes.length) {
        answer.upvotes = filtered;
      }
      else {
        answer.upvotes.push(user);
      }
    }
    else if(v == -1) {
      answer.upvotes = answer.upvotes.filter(item => !(item.equals(user)));
      const filtered = answer.downvotes.filter(v => !v.equals(user));
      if (filtered.length != answer.downvotes.length) {
        answer.downvotes = filtered;
      }
      else {
        answer.downvotes.push(user);
      }
    }

    // increment upvotes counter as simple integer
    // const answer = await Answer.findByIdAndUpdate(id, { $inc: {'upvotes': 1 } }, { returnDocument: 'after' });
    const answer_result = await Answer.findByIdAndUpdate(id, answer, { returnDocument: 'after' });
    return answer_result;
}

export async function deleteAnswer(id) {
  // await deleting a answer
  await Answer.findByIdAndDelete(id);
  // return confirmation
  return { msg: `answer ${id} deleted successfully.` };
}
