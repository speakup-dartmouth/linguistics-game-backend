import { Router } from 'express';
import dotenv from 'dotenv';
import * as Posts from './controllers/post_controller';
import * as Users from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import signS3 from './services/s3';

dotenv.config({ silent: true });

// const { AUTH_SECRET } = process.env;

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the munch api!' });
});

/// your routes will go here

router.route('/posts')
  .post(requireAuth, async (req, res) => {
    try {
      const result = await Posts.createPost(req.body, req.user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      const query = req.query.q;
      if (query) {
        const result = await Posts.findPosts(query);
        res.json(result);
      } else {
        const result = await Posts.getPosts();
        res.json(result);
      }
    } catch (error) {
      res.status(404).json({ error });
    }
  });

router.route('/posts/:postID')
  .get(async (req, res) => {
    try {
      const result = await Posts.getPost(req.params.postID);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  })
  .put(async (req, res) => {
    try {
      const result = await Posts.updatePost(req.params.postID, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Posts.deletePost(req.params.postID);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error });
    }
  });

router.route('/users')
  .get(async (req, res) => {
    try {
      const result = await Users.getUsers();
      res.json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

router.route('/users/:id')
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Users.getUser(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  })
  .put(async (req, res) => {
      try {
        const result = await Users.updateUser(req.params.id, req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
  });

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});
  

router.get('/sign-s3', signS3);

export default router;
