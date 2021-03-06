import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import { bindActionCreators } from 'redux';
import { reduxForm, Field } from 'redux-form/immutable';
import { DropdownList } from 'react-widgets/lib';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import PropTypes from 'prop-types';

// Actions
import * as alertActions from 'Store/reducers/alert/alertActions';
import * as documentActions from 'Store/reducers/upload/uploadActions';
import * as dropzoneActions from 'Store/reducers/dropzone/dropzoneActions';
import * as validateActions from 'Store/reducers/form/validateFileForm/validateActions';

// Selectors
import { getDropzone, getAlert, getDocumentState } from 'Utils/selectors/common';
import { validateRecord } from './validate';
import AlertText from '../../Alert';
import Dropzone from '../../Dropzone';
import {
  Button,
  ModalButtonBox,
  AlertBox,
  Form,
  FormBox,
  Title,
  Alert,
  FieldBox,
  DropzoneBox
} from './style';

const reduxActions = [alertActions, dropzoneActions, validateActions, documentActions];

function mapStateToProps(state) {
  return {
    dropzone: getDropzone(state),
    documentState: getDocumentState(state),
    alertState: getAlert(state)
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...reduxActions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

const Input = ({ input, data, valueField, textField }) => (
  <input
    {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    data={data}
    valueField={valueField}
    textField={textField}
  />
);

Input.propTypes = {
  input: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  valueField: PropTypes.object.isRequired,
  textField: PropTypes.object.isRequired,
  onChange: PropTypes.object.isRequired
};

const renderDropdownList = ({ input, data, valueField, textField }) => (
  <DropdownList
    {...input}
    data={data}
    valueField={valueField}
    textField={textField}
    onChange={input.onChange}
  />
);

renderDropdownList.propTypes = {
  input: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  valueField: PropTypes.object.isRequired,
  textField: PropTypes.object.isRequired,
  onChange: PropTypes.object.isRequired
};

const dropzone = ({ input, data, valueField, textField, actions, change }) => (
  <Dropzone
    {...input}
    data={data}
    valueField={valueField}
    textField={textField}
    onChange={input.onChange}
    actions={actions}
    change={change}
  />
);

dropzone.propTypes = {
  input: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  change: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  valueField: PropTypes.object.isRequired,
  textField: PropTypes.object.isRequired,
  onChange: PropTypes.object.isRequired
};

const UF = props => {
  const handleSubmit = () => {
    props.actions.uploadDocumentRequest(props);
  };

  return (
    <Form>
      <form>
        <FormBox>
          <Title big>Categoria:</Title>
          <FieldBox>
            <Field name="category" component={Input} />
          </FieldBox>
        </FormBox>
        <FormBox>
          <Title>Subcategoria:</Title>
          <FieldBox>
            <Field name="subcategory" component={Input} />
          </FieldBox>
        </FormBox>
        <FormBox>
          <Title>Titulo:</Title>
          <FieldBox>
            <Field name="title" component={Input} />
          </FieldBox>
        </FormBox>
        <FormBox>
          <Title>Fuente de los datos:</Title>
          <FieldBox>
            <Field name="source" component={Input} valueField="value" textField="source" />
          </FieldBox>
        </FormBox>
        <FormBox>
          <Title>Typo de geojson:</Title>
          <FieldBox>
            <Field name="geojsonType" component={renderDropdownList} data={['Point', 'Polygon']} />
          </FieldBox>
        </FormBox>
        <AlertBox>
          <Alert blue>Descarga el esquema de datos</Alert>
          <AlertText {...props} />
        </AlertBox>
        <DropzoneBox>
          <Field
            name="file"
            component={dropzone}
            valueField="value"
            textField="file"
            actions={props.actions}
            change={props.change}
          />
        </DropzoneBox>
      </form>
      <ModalButtonBox>
        <Button cancel="true" onClick={props.handleHide}>
          Salir
        </Button>
        <Button onClick={handleSubmit} disabled={!props.valid}>
          Subir
        </Button>
      </ModalButtonBox>
    </Form>
  );
};

UF.propTypes = {
  record: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  change: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

const UFD = reduxForm({
  form: 'uploadRecordForm',
  validate: validateRecord
})(UF);

const UploadForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UFD);

export default UploadForm;
