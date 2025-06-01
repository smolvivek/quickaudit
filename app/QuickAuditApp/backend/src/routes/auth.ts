import {Router} from 'express';
import {register, login, getProfile} from '../controllers/auth';
import {protect} from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

export const authRouter = router;
