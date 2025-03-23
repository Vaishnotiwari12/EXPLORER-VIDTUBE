<<<<<<< HEAD
import {Router} from 'express';

import {healthcheck} from '../controllers/healthcheck.controller.js';


const router  = Router()

router.route("/").get(healthcheck)

router.route("/test").get(healthcheck)

export default router;


=======
import { Router } from 'express';
import{healthcheck} from '../controllers/healthcheck.controller.js';

// import{healthcheck} from '../routes/healthcheck.routes.js';
const router = express.Router();

router.get('/healthcheck', healthcheck);


// export default (req, res) => {
//     res.json({ message: "Server is running!" });
//   };
 
export default router;
>>>>>>> 04da590bf15e0e749c2341d99d0393f9df98b953
