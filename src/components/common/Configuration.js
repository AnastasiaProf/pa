/**
 * Configuration Component
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Visible, Hidden, ScreenClassRender } from 'react-grid-system';

class Configuration extends Component{
static propTypes = {
    serverSideScreenClass: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  };

  static defaultProps = {
    serverSideScreenClass: 'xl',
  }

  static childContextTypes = {
    serverSideScreenClass: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    breakpoints: PropTypes.arrayOf(PropTypes.number),
  };

  getChildContext = () => ({
    serverSideScreenClass: this.props.serverSideScreenClass,
    breakpoints: [576, 768, 800, 1200],
  });

  styleFunction = (screenClass, props) => {
    let fontSize = 10;
    if (screenClass === 'sm') fontSize = 20;
    if (screenClass === 'md') fontSize = 30;
    if (screenClass === 'lg') fontSize = 40;
    if (screenClass === 'xl') fontSize = 50;
    return {
      fontSize: `${fontSize}px`,
      ...props.style,
    };
  };

  render = () => (
      <div>
    <Container>
      
    </Container>  
    <Container>
      <h1>Responsive grid example</h1>

      <Row>
        <Col sm={6} className="student-description">
          <Row>
            <Col sm={6} >
                <img className="student-picture" src="https://www.shareicon.net/data/2016/06/26/786560_people_512x512.png"/>
            </Col>
            <Col sm={6}>
                <p> Name </p>
                <p> Class </p>
                <p> Description </p>
            </Col>
          </Row> 
        </Col>
        <Col sm={6} className="graph">
          One of three columns
        </Col>
      </Row>

      <h1>Responsive utilties example</h1>

      <p>
        <span>Your current screen class is </span>
        <Visible xs><strong>xs</strong></Visible>
        <Visible sm><strong>sm</strong></Visible>
        <Visible md><strong>md</strong></Visible>
        <Visible lg><strong>lg</strong></Visible>
        <Visible xl><strong>xl</strong></Visible>
        <span>.</span>
      </p>

      <Visible xs sm>
        <p>Paragraph visible on extra small and small.</p>
      </Visible>
      <Hidden xs sm>
        <p>Paragraph hidden on extra small and small.</p>
      </Hidden>
      <Visible md lg>
        <p>Paragraph visible on medium and large.</p>
      </Visible>
      <Hidden md lg>
        <p>Paragraph hidden on medium and large.</p>
      </Hidden>

      <ScreenClassRender style={this.styleFunction}><p style={{ color: 'red' }}>Some red text, which font size depends on the screen class.</p></ScreenClassRender>

    </Container>
      </div>
  );
}

export default Configuration;