import {setSendMessageError} from '../UsernameEntry/actions';
import {setUsersFetchError} from '../Home/actions';
import {setLoadStoreListError} from '../StoreList/actions';

export const clearErrors = () => dispatch => {
  dispatch(setSendMessageError(false));
  dispatch(setUsersFetchError(false));
  dispatch(setLoadStoreListError(false));
};
