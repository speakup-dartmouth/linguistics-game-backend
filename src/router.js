import { Router } from 'express';
import dotenv from 'dotenv';
import * as Questions from './controllers/question_controller';
import * as Users from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import signS3 from './services/s3';
import * as Answers from './controllers/answer_controller';

dotenv.config({ silent: true });

const { AUTH_SECRET, API_KEY } = process.env;

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the linguistics games api!' });
});

router.route('/questions')
  .post(async (req, res) => {
    try {
      const result = await Questions.createQuestion(req.body, req.query, req.user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  })
  .get(async (req, res) => {
    try {
      const result = await Questions.getQuestions(req.query);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

router.route('/questions/:questionID')
  .get(async (req, res) => {
    try {
      const result = await Questions.getQuestion(req.params.questionID);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  })
  .put(async (req, res) => {
    try {
      const result = await Questions.updateQuestion(req.params.questionID, req.query, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Questions.deleteQuestion(req.params.questionID, req.query);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.toString() });
    }
  });

router.route('/answers')
  .post(async (req, res) => {
    try {
      const result = await Answers.createAnswer(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  })
  .get(async (req, res) => {
    try {
      const result = await Answers.getAnswers(req.query);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

router.route('/answers/:answerID')
  .get(async (req, res) => {
    try {
      const result = Answers.getAnswer(req.params.questionID);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  })
  .put(async (req, res) => {
    try {
      const result = await Answers.updateAnswer(req.params.questionID, req.query, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Answers.deleteAnswer(req.params.questionID, req.query);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.toString() });
    }
  });

router.route('/answers/:answerID/vote')
  .post(async (req, res) => {
    try {
      const result = await Answers.voteAnswer(req.params.answerID, req.query, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  });

router.route('/users')
  .get(async (req, res) => {
    try {
      const result = await Users.getUsers(req.query);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

router.route('/users/:id')
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Users.getUser(id, req.query);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  })
  .put(async (req, res) => {
    try {
      const result = await Users.updateUser(req.params.id, req.body, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Users.deleteUser(req.params.id, req.query);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.toString() });
    }
  });

router.route('/users/:id/consent')
  .post(async (req, res) => {
    try {
      const result = await Users.submitConsent(req.params.id);
      res.json(result.toJSON());
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

router.route('/users/:id/collections')
  .get(async (req, res) => {
    try {
      const result = await Users.getCollections(req.params.id, req.query);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.toString() });
    }
  });

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const result = Users.signin(req.user);
    res.json({
      token: result.token,
      id: result.id,
      email: req.user.email,
      username: req.user.username,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const result = await Users.signup(req.body);
    res.json({
      token: result.token,
      id: result.id,
      email: req.body.email,
      username: req.body.username,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.get('/user-info', requireAuth, async (req, res) => {
  try {
    if (req.user) {
      Users.signin(req.user);
      res.json({ ...req.user.toJSON(), token: req.token });
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.get('/sign-s3', signS3);

export default router;
