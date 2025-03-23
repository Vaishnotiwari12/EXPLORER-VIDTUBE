import { Router } from 'express';
import{healthcheck} from '../controllers/healthcheck.controller.js';

// import{healthcheck} from '../routes/healthcheck.routes.js';
const router = express.Router();

router.get('/healthcheck', healthcheck);


// export default (req, res) => {
//     res.json({ message: "Server is running!" });
//   };
 
export default router;

