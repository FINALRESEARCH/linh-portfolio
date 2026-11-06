import {createStudioConfig} from '../../../cms/studio-config'
import {dataset, projectId} from './env'

/** Studio embedded at `/studio` — same schema and theme as the standalone `cms` app. */
export default createStudioConfig({projectId, dataset, basePath: '/studio'})
