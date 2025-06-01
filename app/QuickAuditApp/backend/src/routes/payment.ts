import {Router} from 'express';
import {
  createSubscription,
  cancelSubscription,
  getSubscription,
} from '../controllers/payment';
import {protect} from '../middleware/auth';

const router = Router();

router.post('/subscription', protect, createSubscription);
router.delete('/subscription', protect, cancelSubscription);
router.get('/subscription', protect, getSubscription);

export const paymentRouter = router;
