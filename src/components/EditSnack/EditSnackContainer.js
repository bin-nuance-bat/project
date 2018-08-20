import {connect} from 'react-redux';
import EditSnack from './EditSnack';
import {setActualItem} from '../ConfirmationBox/actions';

const mapStateToProps = state => {
  return {
    items: Object.values(state.storeList),
    prediction: state.prediction,
    dataController: state.dataController,
    suggestions: state.suggestions.map(itemid => state.storeList[itemid]),
    sendWithPhoto: state.sendWithPhoto
  };
};

const mapDispatchToProps = {
  setActualItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSnack);
