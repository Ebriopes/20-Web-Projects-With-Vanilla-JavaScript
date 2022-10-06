import './style.css'

const form = document.forms['login']

function evalError(input) {
  const value = input.value;
  const minLen = input.minLength;
  const maxLen = input.maxLength;
  const type = input.type;

  if (!value.length)
    return null

  if (minLen !== -1 && minLen > value.length)
    return `Short input, try adding more characters (${minLen} or more)`

  if (maxLen !== -1 && maxLen < value.length)
    return `Long input, was exceed the limit characters (${maxLen} or less)`

  if (type === 'email') {
    const emailRegex = new RegExp(`([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])`)

    return emailRegex.test(input.value) ? null : "The email syntax is wrong, please check it";
  }

  if (type === 'password') {
    if (input.name === 'confirm-password') {
      const pass = form['password'];

      return pass.value === value ? null : 'Passwords don\'t match'
    }
    return null
  }
}

const FORM = {
  fields: ['username', 'email', 'password', 'confirm-password'],
  username: {
    id: 'username',
    errorId: 'username-error',
  },
  email: {
    id: 'email',
    errorId: 'email-error',
  },
  password: {
    id: 'password',
    errorId: 'username-error',
  },
  "confirm-password": {
    id: 'confirm-password',
    errorId: 'confirm-error',
  },
}

FORM.fields.forEach(field => {
  const message = document.createElement('div');

  message.id = FORM[field].errorId;

  form.elements.namedItem(field).addEventListener('input', (e) => {
    const input = e.target;
    const parent = input.parentElement;

    const messageText = evalError(input)

    if (messageText) {
      input.style.outlineColor = 'red'

      message.innerHTML = `<span style="color: red"> ${messageText} </span>`

      if (!parent.children[message.id])
        input.insertAdjacentElement('afterEnd', message)
    } else {
      input.style.outlineColor = ''

      if (parent.children[message.id])
        parent.removeChild(message)
    }

    if (field === 'password'){
      const pass = form['confirm-password'].parentElement;

      pass.hidden = !input.value || !input.checkValidity() 
    }
  })
})

document.getElementById('submit-button').onclick = (e) => {
  e.preventDefault()

  const isValidForm = form.reportValidity()

  if (isValidForm)
    alert(`All fine
  Here are your data:
  user: ${form['username'].value}
  email: ${form['email'].value}
  password: ${form['password'].value}`)
}

