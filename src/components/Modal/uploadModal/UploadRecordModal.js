import React from 'react';
import gql from 'graphql-tag';
import { Map } from 'immutable';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { connectModal } from 'redux-modal';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';

/* show, handleHide, message, title */

// Actions
import * as alertActions from 'Store/reducers/alert/alertActions';
import * as dropzoneActions from 'Store/reducers/dropzone/dropzoneActions';
import * as validateActions from 'Store/reducers/form/validateFileForm/validateActions';

// Selectors
import { UploadRecord } from 'Components/Form/uploadForm';
import { getUploadFileForm, getAlert } from 'Utils/selectors/common';
import { ModalOuter, ModalBigBox } from './style';

const actions = [alertActions, dropzoneActions, validateActions];

function mapStateToProps(state) {
  return {
    forms: getUploadFileForm(state),
    alertState: getAlert(state)
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.75)';
Modal.defaultStyles.overlay.zIndex = '999';

Modal.defaultStyles.content = {
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRadius: '4px',
  outline: 'none',
  padding: '20px'
};

const UploadModal = props => (
  <Modal
    isOpen={props.show}
    onRequestClose={() => props.handleHide}
    contentLabel="Modal"
    ariaHideApp={false}
  >
    <ModalOuter>
      <ModalBigBox>
        <UploadRecord {...props} handleHide={props.handleHide} />
      </ModalBigBox>
    </ModalOuter>
  </Modal>
);

UploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired
};

const UM = compose(
  graphql(
    gql`
      mutation Record($record: RecordInput) {
        addRecord(record: $record)
      }
    `,
    {
      name: 'addRecord'
    }
  ),
  withHandlers({
    handleAddRecord: ({ addRecord }) => record => {
      addRecord({
        variables: { record }
      });
    }
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UploadModal);

export default connectModal({
  name: 'uploadRecordModal',
  getModalState: state => state.get('modal')
})(UM);
