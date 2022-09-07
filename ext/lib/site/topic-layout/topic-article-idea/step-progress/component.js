import React from 'react';

export default class StepProgress extends React.Component {
  constructor() {
    super();
    // ooo" console.log('props:', this.props);
    console.log('constructing');

  }
  componentDidMount () {
    console.log('antes de montar')
    if (this.stateProfress == 'preparacion') {
      let bullet = document.querySelector('#preparacion')
      bullet.className += 'active'
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
                  <p className='numero-votos'>1500</p>
                </div>
              </div>
              <p>Presupuesto: {budgetTotal}</p>
        </div>
      </div>
    );
  }
}