import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from 'redux-observable';
import { tweetEpic} from './epics';
import logger from "redux-logger";
import thunk from "redux-thunk";

import reducer from "./reducers"

const epicMiddleware = createEpicMiddleware(tweetEpic);
const middleware = applyMiddleware( logger(), epicMiddleware)

export default createStore(reducer, middleware)
