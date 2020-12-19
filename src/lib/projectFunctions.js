import ProjectModel, {projectSchema} from 'models/projectModel';
import HTTP_STATUS_CODES, {sendErrorResponse} from 'util/httpStatusUtil';

const {requiredFields} = projectSchema.validation;

export function createProject(req, res) {
  const projectDef = req.body;

  if (requiredFields.some(field => projectDef[field] === undefined)) {
    return sendErrorResponse(res, 'One or more required fields was missing in request', HTTP_STATUS_CODES.PRECONDITION_FAILED);
  }

  return new ProjectModel(projectDef).save()
    .then(response => res.json({msg: 'Project created successfully', projectId: response._id}))
    .catch((e) => {
      console.warn('An error occurred created project', e);
      return sendErrorResponse(res, 'Project could not be inserted to database');
    });
}


// nice to have: return a 'paging token' for client to use; if no more entries, this token won't be
// sent. ie save client from making a useless request.
export function getManyProjects(req, res) {
  console.info(`getManyProjects req=${JSON.stringify(req.query)}`);
  const {numRecords = '50', page = '0', search} = req.query;
  let {sort} = req.query;
  if (sort === '') {
    sort = 'relevancy';
  }

  const pageNum = parseInt(page, 10);
  const recordsInt = parseInt(numRecords, 10);

  const recordsToSkip = pageNum * recordsInt;

  return ProjectModel.find()
    .skip(recordsToSkip)
    .limit(recordsInt)
    .populate(['creator', 'contactInfo', 'roles'])
    .then(result => res.json(result))
    .catch((e) => {
      console.error(`An error occurred getting projects for page ${page}, on ${numRecords} records`, e);
      return sendErrorResponse(res, 'An error occurred while fetching projects');
    });
}

export function getProject(req, res) {
  const {projectId} = req.params;

  return ProjectModel.findById(projectId, {rawResult: false})
    .populate(['creator', 'contactInfo'])
    .then(result => res.json({
      msg: 'Success!',
      ...result._doc,
    }))
    .catch((e) => {
      console.warn(`An error occurred getting project ${projectId}`, e);
      return sendErrorResponse(res, `Could not find project ${projectId}`);
    });
}

