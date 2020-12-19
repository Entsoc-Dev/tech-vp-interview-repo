import express from 'express';
import {
    createProject, getManyProjects, getProject, findProjectName, findProjectDescription,
  } from 'lib/projectFunctions';

const router = express.Router();

router.get('/searchTitle/:title', findProjectName)
router.get('/searchDescription/:description', findProjectDescription); 
router.get('/:projectId', getProject);
router.get('/', getManyProjects);
router.post('', createProject);

export default router;
