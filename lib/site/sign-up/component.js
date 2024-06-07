import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import ReCAPTCHA from 'react-google-recaptcha'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      name: '',
      lastName: '',
      dni: '',
      facultad: '',
      claustro: '',
      email: '',
      pass: '',
      captchaKey: '',
      used: false,
      showMap: false,

      claustros: [],
      facultades: [],
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveClaustro = this.saveClaustro.bind(this)
    this.saveLastName = this.saveLastName.bind(this)
    this.saveFacultad = this.saveFacultad.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
    this.saveDNI = this.saveDNI.bind(this)
    this.savePass = this.savePass.bind(this)
    this.checkPassLength = this.checkPassLength.bind(this)
    this.onCaptchaChange = this.onCaptchaChange.bind(this)
    this.onSubmitClick = this.onSubmitClick.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form:load', 'signup')
    this.setState({ active: 'form' })

    facultadStore.findAll().then(facultades => {
      this.setState({ facultades })
      claustroStore.findAll().then(claustros => this.setState({ claustros }))

  })
  }

  componentWillUnmount () {
    bus.emit('user-form:load', '')
  }

  onSubmit () {
    this.setState({ loading: true, errors: null, used: true })
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'congrats',
      errors: null,
      captchaKey: ''
    })
  }

  onFail (err) {
    this.setState({ loading: false, errors: err, captchaKey: '' })
  }

  saveName (e) {
    this.setState({ name: e.target.value })
  }

  saveLastName (e) {
    this.setState({ lastName: e.target.value })
  }

  saveDNI (e) {
    this.setState({ dni: e.target.value })
  }

  saveEmail (e) {
    this.setState({ email: e.target.value })
  }

  savePass (e) {
    this.setState({ pass: e.target.value })
  }

  saveFacultad (e) {
    this.setState({ facultad: e.target.value })
  }

  saveClaustro(e) {
    this.setState({ claustro: e.target.value })
  }

  setShowMap (e) {
    this.setState({ showMap: !this.state.showMap })
  }



  checkPassLength (e) {
    const passLength = e.target.value

    if (passLength.length < 6) {
      e.target.setCustomValidity(t('validators.min-length.plural', { n: 6 }))
    } else {
      if (e.target.name === 're_password' && e.target.value !== this.state.pass) {
        e.target.setCustomValidity(t('common.pass-match-error'))
      } else {
        e.target.setCustomValidity('')
      }
    }
  }

  onCaptchaChange (key) {
    this.setState({ captchaKey: key })
    this.refs.submitBtn.click()
  }

  onSubmitClick (e) {
    if (config.recaptchaSite && !this.state.captchaKey) {
      this.captcha.execute()
      e.preventDefault()
    }
  }

  render () {
    const { claustros, facultades } = this.state

    return (
      <div className='center-container'>
        {/* <div className="container">
          <div className="row">
            <div className='panel panel-danger' role='alert' style={{fontSize: '12px', marginTop: '10px'}}>
              <div className="panel-heading">
                <h3 className="panel-title">📢 Importante</h3>
              </div>
              <div className="panel-body">
                <p>Debido a la <u>alta demanda</u> en registros y recuperaciones de contraseña, <b>las cuentas de correo de Microsoft (hotmail.com/live.com/outlook.com) han tenido problemas</b> en recibir correo. Esto se debe a un factor externo fuera de nuestro control. Si han tenido problemas en recuperar contraseña o en registrarse utilizando, le pedimos que vuelvan a intentarlo. </p>
                <p>📣 Los correos de otros proveedores como Gmail, Yahoo, etc. <u>no se ven afectados</u>. ✅</p>
                <p>👉 <b>Si ya te registraste</b>: Hemos validado todas las cuentas que no han podido recibir su correo para confirmar su registro. Por favor, intente iniciar sesión.</p>
                <p>👉 <b>Si aun no te registraste</b>: Vas a poder registrarte normalmente y comenzar a participar, te pedimos que una vez que termines de registrate, inicies sesión.</p>
                <p>👉 <b>Si te olvidaste tu contraseña y no logras recibir el correo</b>: Por favor te pedimos que esperes unas horas y vuelvas a intentarlo. De no poder lograrlo, enviános un email a it@democracyos.io</p>
              </div>
            </div>
          </div>
        </div> */}
        {
          this.state.active === 'form' &&
          (
            <div id='signup-form' className='mt-4'>
              <h1 className='ingresar-title'>{t('signup.with-email')}</h1>
              <h5 className='ingresar-subtitle'>*No estas en el padrón? Completa el siguiente form</h5>
              <FormAsync
                action='/api/signup'
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                {config.recaptchaSite && (
                  <ReCAPTCHA
                    ref={(el) => { this.captcha = el }}
                    size='invisible'
                    sitekey={config.recaptchaSite}
                    onChange={this.onCaptchaChange} />
                )}
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
                <input
                  type='hidden'
                  name='facultad'
                  value={this.state['facultad']} />                  
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key} dangerouslySetInnerHTML={{ __html: error }}></li>))
                  }
                  <br/>
                  <a
                    href='/signup'>
                    Recargar y volver a intentar
                   </a>
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.email')}</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    maxLength='200'
                    onChange={this.saveEmail}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Vuelva a escribir su correo electrónico</label>
                  <input
                    type='email'
                    className='form-control'
                    name='re_email'
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-firstname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='firstName'
                    name='firstName'
                    maxLength='100'
                    onChange={this.saveName}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-lastname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='lastName'
                    name='lastName'
                    maxLength='100'
                    onChange={this.saveLastName}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>DNI</label>
                  <input
                    type='text'
                    className='form-control'
                    id='dni'
                    name='dni'
                    maxLength='20'
                    onChange={this.saveDNI}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>Claustro</label>
                  <select
                    className='form-control'
                    id='claustro'
                    name='claustro'
                    onChange={this.saveClaustro}
                    required>
                    <option value=''>- Seleccioná un claustro -</option>
                    {claustros.length > 0 && claustros.map(claustro =>
                      <option key={claustro._id} value={claustro._id}>
                        {claustro.nombre}
                      </option>
                    )}
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='facultad'>
                    Facultad
                  </label>
                  <select
                    className='form-control'
                    id='facultad'
                    name='facultad'
                    onChange={this.saveFacultad}
                    value={this.state['facultad']}
                  >
                    <option value=''>Seleccione una facultad...</option>
                    {facultades.length > 0 && facultades.map(facultad =>
                      <option key={facultad._id} value={facultad._id}>
                        {facultad.nombre}
                      </option>
                    )}
                  </select>              
                </div>

                {/* {this.state.showMap && <div>
                  <iframe src="https://www.google.com/maps/d/embed?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu" width="640" height="480"></iframe>
                  <p>Puede ver el <a href="https://www.google.com/maps/d/viewer?mid=1Q1kDWfyz0PCdRx1OFlNoOA644HP9W2Bu&ll=-37.97165492717815%2C-57.78389299999999&z=10" target="_blank">mymaps completo aqui</a></p>
                  </div>} */}
                <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='password'
                    maxLength='200'
                    onChange={this.savePass}
                    onBlur={this.checkPassLength}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.retype-password')}</label>
                  <input
                    type='password'
                    className='form-control'
                    name='re_password'
                    onBlur={this.checkPassLength}
                    required />
                </div>
                {
                    (!!config.termsOfService || !!config.privacyPolicy) &&
                    (
                      <div className='form-group accepting'>
                        <p className='help-block text-center'>
                          {t('signup.accepting')}
                        </p>
                        {
                          !!config.termsOfService &&
                          (
                            <Link
                              to='/s/terminos-y-condiciones'>
                              {t('help.tos.title')}
                            </Link>
                          )
                        }
                        {
                          !!config.privacyPolicy &&
                          (
                            <Link
                              to='/s/privacy-policy'>
                              {t('help.pp.title')}
                            </Link>
                          )
                        }
                      </div>
                    )
                  }
                <div className='form-group'>
                  {!this.state.used &&
                    <button
                      ref='submitBtn'
                      onClick={this.onSubmitClick}
                      className={!this.state.loading ? 'btn btn-block btn-primary-unmdp btn-lg' : 'hide'}
                      type='submit'
                    >
                      {t('signup.now')}
                    </button>
                  }
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader' />
                    {t('signup.now')}
                  </button>
                </div>

              </FormAsync>
              <div className='ingresa-cuenta'>
                <p>Si ya tenés una cuenta </p>
                <Link
                  to={`/signin${window.location.search}`}>
                  ingresá acá
                </Link>
              </div>
            </div>
          )
        }
        {
          this.state.active === 'congrats' &&
          (
            <div id='signup-message'>
              <h1>{t('signup.welcome', { name: this.state.name + ' ' + this.state.lastName })}</h1>
              <p className='lead'>{t('signup.received')}</p>
              <Link
                to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
              {/*  <h1>¡Gracias por registrarte {this.state.name}!</h1>
              <p className='lead'>Ya hemos validado tu cuenta y podés comenzar a participar. Para eso, te pedimos que inicies sesión. </p>
              <Link
                to={`/signin${window.location.search}`}>
                Iniciar sesión
              </Link> */}
            </div>
          )
        }
      </div>
    )
  }
}
