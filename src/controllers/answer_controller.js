import Answer from '../models/answer_model';

export async function createAnswer(answerFields) {
  // await creating a answer
  const answer = new Answer();
  answer.user = answerFields.user;
  answer.question = answerFields.question;
  answer.recording = answerFields.recording;

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

export async function voteAnswer(id, query, fields) {
    if(!query || !query.increment || query.increment < -1 || query.increment > 1) {
      throw new Error('missing valid increment value as query string. usage: /answers/answerID/vote?increment={-1,0,1}');
    }
    const { increment } = query;
    const answer = await Answer.findById(id).lean();
    if (!answer) {
      throw new Error('answer not found');
    }
    const { user } = fields;

    if(user == answer.user) {
      throw new Error('user cannot upvote own post');
    }

    answer.upvotes = answer.upvotes.filter(item => !(item.equals(user)));
    answer.downvotes = answer.downvotes.filter(item => !(item.equals(user)));

    if(increment == 1) {
      answer.upvotes.push(user);
    }
    else if(increment == -1) {
      answer.downvotes.push(user);
    }

    console.log(answer);

    // increment upvotes counter as simple integer
    // const answer = await Answer.findByIdAndUpdate(id, { $inc: {'upvotes': 1 } }, { returnDocument: 'after' });
    const answer_result = await Answer.findByIdAndUpdate(id, answer, { returnDocument: 'after' });
    return answer_result;
    // return answer
  try {
    const savedAnswer = await answer.save();
    return savedAnswer;
  } catch (error) {
    throw new Error(`upvote answer error: ${error}`);
  }
}

export async function deleteAnswer(id) {
  // await deleting a answer
  await Answer.findByIdAndDelete(id);
  // return confirmation
  return { msg: `answer ${id} deleted successfully.` };
}
