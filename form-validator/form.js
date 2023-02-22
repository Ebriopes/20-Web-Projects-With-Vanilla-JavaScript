import './style.css';

const FORMFIELDS = {
  username: {
    id: 'username',
    errorId: 'username-error',
    required: true,
    valid: false
  },
  email: {
    id: 'email',
    errorId: 'email-error',
    required: true,
    valid: false
  },
  password: {
    id: 'password',
    errorId: 'username-error',
    hidder: 'confirm-password',
    shouldHide: true,
    required: true,
    valid: false
  },
  "confirm-password": {
    id: 'confirm-password',
    errorId: 'confirm-error',
    required: true,
    valid: false
  },
};

class LoginForm {
  #valid = false;

  constructor ( form, fields ) {
    this.form = form;
    this.fields = fields;
    const submit = form.elements.namedItem( 'submit-button' );
    const fieldValues = Object.values( fields );

    fieldValues.forEach( field => {
      const container = document.createElement( 'div' );

      container.id = field.errorId;
      field.errorLabel = container;
      field.target = form.elements.namedItem( field.id );
    } );

    this.form.addEventListener( 'input', ( e ) => {
      const inputId = e.target.id;

      this.#checkField( fields[ inputId ] );

      this.#valid = fieldValues.every( ( field ) => field.valid );

      submit.disabled = !this.#valid;
    } );
  }

  #checkField( field ) {
    const input = field.target;
    const parent = input?.parentElement;
    const errorLabel = field.errorLabel;
    const errorText = this.#evalError( input );

    // Error alert below of the fields
    if ( errorText ) {
      input.style.outlineColor = 'red';
      input.style.marginTop = '0.5rem';

      errorLabel.innerHTML = `<span style="color: red"> ${ errorText } </span>`;

      if ( !parent.children[ field.errorId ] )
        input.insertAdjacentElement( 'afterEnd', errorLabel );

      field.valid = false;
    } else {
      input.style.outlineColor = '';

      if ( parent.children[ field.errorId ] )
        parent.removeChild( errorLabel );

      field.valid = true;
    }

    if ( field?.shouldHide ) {
      const hidder = this.fields[ field.hidder ].target;
      hidder.parentElement.hidden = !field.valid || !input?.value || !input?.checkValidity();
    }
  }

  #evalError( input ) {
    const value = input.value;
    const minLen = input.minLength;
    const maxLen = input.maxLength;
    const type = input.type;

    if ( !value.length )
      return null;

    if ( minLen !== -1 && minLen > value.length )
      return `Short input, try adding more characters (${ minLen } or more)`;

    if ( maxLen !== -1 && maxLen < value.length )
      return `Long input, was exceed the limit characters (${ maxLen } or less)`;

    if ( type === 'email' ) {
      const emailRegex = new RegExp( `([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])` );

      return emailRegex.test( input.value ) ? null : "The email syntax is wrong, please check it";
    }

    if ( type === 'password' ) {
      if ( input.name === 'confirm-password' ) {
        const pass = form[ 'password' ];

        return pass.value === value ? null : 'Passwords don\'t match';
      }
      return null;
    }
  }

  get valid() {
    return this.#valid && this.form.reportValidity();
  }
}

const form = document.forms[ 'login' ];

const loginForm = new LoginForm( form, { ...FORMFIELDS } );

document.getElementById( 'submit-button' ).onclick = ( e ) => {
  e.preventDefault();

  const isValid = loginForm.valid;

  if ( isValid )
    alert( `All fine
  Here are your data:
  user: ${ form[ 'username' ].value }
  email: ${ form[ 'email' ].value }
  password: ${ form[ 'password' ].value }` );
};
