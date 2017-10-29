import { ajax } from 'rxjs/observable/dom/ajax';

export const tweetEpic = action$ =>
    action$.ofType('FETCH_TWEETS')
        .switchMap(() =>
            ajax.getJSON(
                "http://rest.learncode.academy/api/reacttest/tweets")
                .map(response => ({ type: 'FETCH_TWEETS_FULFILLED', payload: response }),
            )
                .takeUntil(action$.ofType('FETCH_CANCEL'))
                .catch(({ xhr }) => ({ type: 'FETCH_TWEETS_REJECTED', payload: xhr }))
        );
