import React, { Fragment } from 'react';
import { reduxForm, Field, submit } from 'redux-form/immutable';
import 'react-widgets/dist/css/react-widgets.css';
import PropTypes from 'prop-types';
import formValidate from 'Utils/validations';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { compose } from 'recompose';

// Actions
import * as modalActions from 'Store/reducers/modal/modalActions';

import { getIntl } from 'Utils/selectors/common';
import {
  Button,
  ModalButtonBox,
  RegisterButton,
  ItemBox,
  Form,
  FormBox,
  Label,
  FieldBox
} from '../style';

// Selectors

const actions = [modalActions];

function mapStateToProps(state) {
  return {
    intlState: getIntl(state)
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

class LF extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.dispatch(submit('signInForm'));
    // props.handleHide();
  };

  handleSignUp = () => {
    this.props.handleHide();
    this.props.actions.show('signupModal');
  };

  handleResetPassword = () => {
    this.props.handleHide();
    this.props.actions.show('reset_passwordModal');
  };

  renderField = ({ input, label, meta: { touched, error, warning }, ...rest }) => (
    <Fragment>
      <label htmlFor={input.name}>
        <input id={input.name} {...input} {...rest} />
        <div style={{ height: '1rem' }}>
          {(touched && (error && <div>Campo Requerido</div>)) ||
            (warning && <div>{rest.warning}</div>)}
        </div>
      </label>
    </Fragment>
  );

  render() {
    const { submitting, formState } = this.props;

    const username = {
      name: 'username',
      type: 'text',
      component: this.renderField,
      label: 'username',
      placeholder: 'username',
      disabled: this.props.formState.get('isFetching'),
      maxLength: 20,
      warning: 'Debe tener entre 6-12 caracteres'
    };

    const password = {
      name: 'password',
      type: 'password',
      component: this.renderField,
      label: 'contraseña',
      placeholder: 'contraseña',
      disabled: this.props.formState.get('isFetching'),
      maxLength: 12,
      warning: 'Debe tener entre 8-12 caracteres con al menos 1 número y una letra en miniscula'
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormBox>
          <ItemBox>
            <Label>Usuario:</Label>
            <FieldBox>
              <Field
                {...username}
                validate={[formValidate.isRequired, formValidate.isUsername]}
                warn={formValidate.isUsername}
              />
            </FieldBox>
          </ItemBox>
          <ItemBox>
            <Label>Contraseña:</Label>
            <FieldBox>
              <Field
                {...password}
                validate={[formValidate.isRequired, formValidate.isPassword]}
                warn={formValidate.isPassword}
              />
            </FieldBox>
          </ItemBox>
        </FormBox>
        <ModalButtonBox>
          <Button disabled={submitting || formState.isFetching} onClick={this.handleSubmit}>
            ENTRAR
          </Button>
        </ModalButtonBox>
        <ModalButtonBox>
          <RegisterButton onClick={this.handleSignUp}>¿No tienes cuenta? Regístrate</RegisterButton>
          <RegisterButton onClick={this.handleResetPassword}>
            ¿Olvidaste tu contrasena?
          </RegisterButton>
        </ModalButtonBox>
      </Form>
    );
  }
}

LF.propTypes = {
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleHide: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const Login = reduxForm({
  form: 'signInForm',
  shouldAsyncValidate: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  onSubmit: (values, _, { actions: { signIn }, client: apolloClient }) =>
    signIn({ username: values.get('username'), password: values.get('password'), apolloClient })
})(LF);

const LoginForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Login);

export default LoginForm;