import React from 'react';

export default class StepProgress extends React.Component {
  constructor() {
    super();
    // ooo" console.log('props:', this.props);
    console.log('constructing');
    this.state = {}
  }
  componentDidMount () {
    this.state = this.props
    const stateComplete = this.state
    const voteState = stateComplete.state
    const stateProfress = stateComplete.completeState['presupuesto-estado']
    const budgetTotal = stateComplete['presupuesto-total']
    console.log('antes de montar\n',stateProfress)

    // ooo" Ahora encadenar los if segun cada etapa mas las clases CSS
    // que se suman siempre onc el active y los selectores de id #
    if (stateProfress == 'preparacion') {
      let bullet = document.querySelector('#preparacion')
      bullet.className += 'active'
    } else     if (stateProfress == 'compra') {
      let bullet = document.querySelector('#preparacion')
      bullet.className += 'active'
      bullet = document.querySelector('#compra')
      bullet.className += 'active'
    } else     if (stateProfress == 'ejecucion') {
      let bullet = document.querySelector('#preparacion')
      bullet.className += 'active'
      bullet = document.querySelector('#compra')
      bullet.className += 'active'
      bullet = document.querySelector('#ejecucion')
      bullet.className += ' active'
    } else     if (stateProfress == 'finalizado') {
      console.log('else >>finalizado');

      let bullet = document.querySelector('#preparacion')
      bullet.className += 'active'
      bullet = document.querySelector('#compra')
      bullet.className += 'active'
      bullet = document.querySelector('#ejecucion')
      bullet.className += ' active'
      bullet = document.querySelector('#finalizado')
      bullet.className += '   active'
    }else{
      console.log('ELSE DIDMOUNT  >>>>>', this.state["presupuesto-estado"])

    }
  }
  render() {
    // ooo" console.log('props:', this.props);
    
    const stateComplete = this.props.completeState
    const voteState = stateComplete.state
    const stateProfress = stateComplete['presupuesto-estado']
    const budgetTotal = stateComplete['presupuesto-total']
    console.log('stateComplete', this.props.completeState);

    return (
      <div>
            <div className='topic-article-idea title-progress'>Seguimiento / Estado de proyecto</div>
            <div className='contenedor-progress'>
              {/* <h3>{voteState}</h3> */}
              {/* <h3>{stateProfress}</h3> */}
              <div className='contenedor-etapas'>
                <div className='flex-col'>
                  <p className='subtitle-progress'>ETAPAS</p>
                    <div className='step-progressbar bullets'>
                      <div className='bullet-div'>
                        <p className='step-text'>Preparación</p>
                        <div id="preparacion" className='step bullet-wrapper '>
                            <div className='bullet'></div>
                        </div>
                      </div>
                      <div className='bullet-div'>
                        <p className='step-text'>Compra</p>
                        <div id="compra" className='step bullet-wrapper '>
                            <div className='bullet'></div>
                        </div>
                      </div>
                      <div className='bullet-div'>
                        <p className='step-text'>Ejecución</p>
                        <div id="ejecucion" className='step bullet-wrapper'>
                            <div className='bullet'></div>
                        </div>
                      </div>
                      <div className='bullet-div'>
                        <p className='step-text'>Finalizado</p>
                        <div id="finalizado" className='step bullet-wrapper'>
                            <div className='bullet'></div>
                        </div>
                      </div>
                  </div>
                </div>
                <div className='contenedor-votos'>
                  <p>VOTOS</p>
                  <p className='numero-votos'>{budgetTotal}</p>
                </div>
              </div>
              <p>Presupuesto: {budgetTotal}</p>
        </div>
      </div>
    );
  }
}