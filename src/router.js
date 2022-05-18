import { Router } from 'express';
import * as Posts from './controllers/post_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the munch api!' });
});

router.route('/posts')
  .post(async (req, res) => {
    try {
      const result = await Posts.createPost(req.body);
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

export default router;
