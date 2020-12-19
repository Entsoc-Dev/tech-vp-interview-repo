import express from 'express';
import {createProject, getManyProjects, getProject,} from 'lib/projectFunctions';

const router = express.Router();

router.get('/:projectId', getProject);
router.get('/', getManyProjects);
router.post('', createProject);

export default router;
