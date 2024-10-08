import React, {Component} from 'react'
import Footer from   'ext/lib/site/footer/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'

export default class Page extends Component {
  componentDidMount () {
    this.goTop()
  }

  goTop () {
    Anchor.goTo('container')
  }

  render () {
    return (
      <div>
        <section className="banner-static">
          <div className="banner"></div>
          <div className="contenedor largo">
            <div className="fondo-titulo">
              <h1>Términos y Condiciones</h1>
            </div>
          </div>
        </section>
        <Anchor id="container">
          <div className="ext-terminos-y-condiciones">
            <p>
              Los siguientes términos y condiciones regulan el uso de la
              plataforma Presupuesto Participativo UNMDP. El registro y uso de
              la plataforma por parte de usuarias/os indica la aceptación
              absoluta de los términos y condiciones presentes y de la política
              de privacidad.
            </p>
            <h2>
              <span>Registro en la plataforma web</span>
            </h2>
            <p>
              El ingreso al Presupuesto Participativo UNDMP no requiere registro
              online previo, el mismo será requerido si la/el usuaria/o desea
              publicar contenidos o interactuar con otros/as usuarios/as.
              Esperamos que te registres usando tu nombre. Las cuentas de "bots"
              u otros registros automáticos no están permitidas. Los/as
              usuarios/as son responsables de preservar la privacidad de su
              cuenta protegiendo el acceso a sus contraseñas.
            </p>
            <p>
              Por favor, ante cualquier ingreso indebido en tu cuenta,
              comunícate inmediatamente a través de{" "}
              <a href="mailto:presupuestoparticipativo@mdp.edu.ar">
                presupuestoparticipativo@mdp.edu.ar
              </a>
              .
            </p>

            <h2>
              <span>Validación de usuarios</span>
            </h2>
            <p>
              Presupuesto Participativo UNMDP se reserva el derecho de validar
              la información brindada por la/el usuaria/o al momento de la
              inscripción. En caso de que la información brindada no pueda
              validarse, Presupuesto Participativo se reserva el derecho de no
              dar de alta a ese usuario/a. Por su parte, Presupuesto
              Participativo deslinda su responsabilidad en el caso de no ser
              veraz la información suministrada al respecto.
              <br />
              Al momento de la inscripción el/la usuario/a asume el compromiso y
              la responsabilidad de:
            </p>
            <ul>
              <li>
                No proporcionar información personal falsa ni crear cuentas a
                nombre de terceras personas sin autorización.
              </li>
              <li>No crear más de una cuenta personal.</li>
              <li>
                No compartir la contraseña ni permitir que otra persona acceda a
                su cuenta
              </li>
              <li>
                Presupuesto Participativo UNDMP se reserva el derecho de
                rechazar cualquier solicitud de inscripción o de cancelar un
                registro previamente aceptado.
              </li>
            </ul>

            <h2>
              <span>Usuarios, obligaciones y condiciones</span>
            </h2>
            <p>
              La/el usuaria/o deberá respetar estos términos y condiciones de
              uso. Las infracciones por acción u omisión de estos términos y
              condiciones de uso generarán el derecho a favor de Presupuesto
              Participativo UNDMP de suspender al/la usuario/a que las haya
              realizado.
              <br />
              La/el usuaria/o es responsable del contenido que suba, publique o
              muestre en Presupuesto Participativo UNDMP, garantizando que el
              mismo no infringe derechos de terceras personas ni los términos y
              condiciones de uso ni viola ninguna ley, reglamento u otra
              normativa.
              <br />
              Los/as usuarios/as entienden y aceptan que el material y/o
              contenido que suba y/o publique podría ser utilizado por otros/as
              usuarios/as de la plataforma web y/o por terceras personas ajenas,
              y que Presupuesto Participativo UNMDP no será responsable en
              ningún caso por tales utilizaciones.
              <br />
              La/el usuaria/o debe usar Presupuesto Participativo UNDMP en forma
              correcta y lícita. En caso contrario, Presupuesto Participativo
              UNDMP podrá retirar el contenido y/o suspender la cuenta de
              aquellos/as usuarios/as que incurran en actitudes contrarias a
              estos términos y condiciones y/o de la política de privacidad,
              ofensivas, ilegales, violatorias de derechos de terceras personas,
              contrarias a la moral y buenas costumbres y/o amenaza para la
              seguridad de otros usuarios.
              <br />
              Con relación a los aportes, colaboraciones y comentarios que
              los/as usuarios/as realicen con respecto a las iniciativas
              propuestas, las mismas no son de carácter vinculante, obligatorio
              y/o impositivo en relación con las acciones de la UNDMP.
            </p>

            <h2>
              <span>Actividades Prohibidas</span>
            </h2>
            <p>
              Las siguientes actividades, sean lícitas o ilícitas, se encuentran
              expresamente vedadas, sin perjuicio de las prohibiciones generales
              expuestas anteriormente:
            </p>
            <ul>
              <li>
                Hostigar, acosar, amenazar, acechar, realizar actos de
                vandalismo hacia otros/as usuarios/as.
              </li>
              <li>
                Infringir los derechos a la intimidad de otros/as usuarios/as.
              </li>
              <li>
                Solicitar información personal identificable de otros/as
                usuarios/as con el propósito de hostigar, atacar, explotar,
                violar la intimidad de personas.
              </li>
              <li>
                Publicar de manera intencionada o con conocimiento injurias o
                calumnias.
              </li>
              <li>
                Publicar, con el intento de engañar, contenido que es falso o
                inexacto.
              </li>
              <li>
                Intentar usurpar la identidad de otro/a usuario/a, representando
                de manera falsa su afiliación con cualquier individuo o entidad,
                o utilizar el nombre de otro/a usuario/a con el propósito de
                engañar.
              </li>
              <li>
                Promover, defender o mostrar pornografía, obscenidad,
                vulgaridad, blasfemia, odio, fanatismo, racismo y/o violencia.{" "}
              </li>
              <li>
                Vulnerar los derechos establecidos en la Ley N° 25.326 de
                Protección de Datos Personales.
              </li>
            </ul>
            <p>
              En caso de sufrir alguna de estas situaciones, comunicarse con
              Presupuesto Participativo UNMDP a través de{" "}
              <a href="mailto:presupuestoparticipativo@mdp.edu.ar">
                presupuestoparticipativo@mdp.edu.ar
              </a>
              .
            </p>

            <h2>
              <span>
                Moderación de la actividad en Presupuesto Participativo{" "}
              </span>
            </h2>
            <p>
              La actividad en esta plataforma web contará con moderadores/as
              responsables de hacer cumplir estos términos y condiciones de uso.
              Los/as mismos/as serán designados/as por la Universidad Nacional
              de Mar del Plata en pos de fomentar un diálogo franco y abierto
              que evite afrentas a personas o instituciones, material comercial
              no relacionado (SPAM) u otros desvíos de la intención original de
              Presupuesto Participativo:
            </p>
            <ul>
              <li>
                Rechazar o eliminar contenido que no cumpla con estos términos
                de uso o que, de alguna forma, sea cuestionable.
              </li>
              <li>
                Quitar el acceso a quien no cumpliera, de alguna forma, con
                estos términos de uso.
              </li>
            </ul>

            <h2>
              <span>Políticas de Privacidad</span>
            </h2>
            <p>
              LLa recolección y tratamiento de los datos personales tiene como
              finalidad conocer sobre el uso de Presupuesto Participativo y
              mejorar la propuesta.
              <br />
              La Universidad Nacional de Mar del Plata no cederá a ninguna otra
              persona ni organismo los datos personales de los participantes,
              salvo orden judicial. Los datos recabados tienen por único objeto
              verificar que las propuestas sean presentadas por personas
              legalmente habilitadas para hacerlo y evitar abusos en el uso de
              la plataforma. Esta información será utilizada exclusivamente para
              obtener estadísticas generales de los/as usuarios/as.
            </p>

            <h2>
              <span>Información proporcionada por los usuarios:</span>
            </h2>
            <p>
              Las interacciones en Presupuesto Participativo UNMDP requieren que
              los/as usuarios/as se registren. En ese caso, se solicitará
              información personal, como nombre y apellido, documento, dirección
              legal y dirección de correo electrónico. El perfil que es visible
              públicamente puede incluir el nombre y la foto seleccionada.
              <br />
              Asimismo, si un/a usuario/a se pone en contacto con Presupuesto
              Participativo UNMDP es posible que guardemos constancia de la
              comunicación para poder resolver más fácilmente cualquier
              incidencia que se haya producido
            </p>

            <h2>
              <span>
                Información obtenida a partir del uso de la plataforma:
              </span>
            </h2>
            <p>
              Presupuesto Participativo UNMDP puede recopilar información sobre
              la forma en que los/as usuarios/as usan la plataforma. Entre la
              información obtenida de esta forma, se incluye el tipo de
              navegador utilizado, la preferencia de lenguaje y, por ejemplo,
              los comentarios que ha realizado.
              <br />
              Presupuesto Participativo UNDMP podrá compartir información de
              manera agregada, y en carácter no personal, con el público en
              general (por ejemplo, mostrar tendencias sobre el uso del sitio).
              <br />
              Presupuesto Participativo UNDMP garantiza la debida protección de
              los datos personales almacenados en esta plataforma web, así como
              también el acceso a la información registrada en el mismo, de
              conformidad a lo establecido en el artículo 43, párrafo tercero de
              la Constitución Nacional y la Ley N° 25.326 de Protección de los
              Datos Personales.
              <br />
            </p>
            <h2>
              <span>Tecnología:</span>
            </h2>
            <p>
              Presupuesto Participativo es un desarrollo basado en{" "}
              <a href="https://democracyos.org/" target="_blank">
                DemocracyOS
              </a>{" "}
              con la coordinación de la Universidad Nacional de Mar del Plata.
              DemocracyOS es una plataforma online de código abierto
              especialmente diseñada para informar, debatir y comprometerse con
              propuestas públicas hacia la construcción de una democracia
              adaptada al siglo XXI. DemocracyOS es desarrollado por la
              Fundación{" "}
              <a href="https://democraciaenred.org/" target="_blank">
                Democracia en Red
              </a>
              .
            </p>
            <p>
              <span></span>
            </p>
          </div>
        </Anchor>
        <Jump goTop={this.goTop} />
        <Footer />
      </div>
    );
  }
}
