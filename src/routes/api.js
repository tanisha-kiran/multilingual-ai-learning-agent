import express from 'express';
import { TopicController } from '../controllers/TopicController.js';

const router = express.Router();
const topicController = new TopicController();

router.post('/topic/process', (req, res) => topicController.processTopicRequest(req, res));
router.get('/languages', (req, res) => topicController.getLanguages(req, res));

export default router;
