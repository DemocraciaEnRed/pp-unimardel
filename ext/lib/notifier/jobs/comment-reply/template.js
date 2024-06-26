const config = require('lib/config')
const utils = require('lib/utils')

const html = require('es6-string-html-template').html
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

// original en: https://github.com/DemocracyOS/notifier/blob/master/lib/templates/lib/comment-reply.js
module.exports = ({
  userName, topicTitle, reply, comment, url
}, {
  lang
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>El usuario <strong>${reply.author.fullName}</strong> respondió un comentario en <strong>${topicTitle}</strong>.</p>
    <p>Comentario original por <strong>${comment.author.fullName}</strong>:</p>
    <div style='padding:15px;padding-top:10px;border-radius: 5px;'><i>${comment.text}</i></div>
    <br />
    <p>Respuesta por <strong>${reply.author.fullName}</strong>:</p>
    <div style='padding:15px;padding-top:10px;border-radius: 5px;'><i>${reply.text}</i></div>
    <br />
    <p>¡Seguí la charla y colaboremos para construir la universidad que queremos!</p>
    <br />
    ${buttonTemplate({
      url: url,
      text: 'Ver respuesta'
    })}
  `
})
