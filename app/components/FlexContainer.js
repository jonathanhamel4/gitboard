import React from 'react';
import PropTypes from 'prop-types';

import { Container } from 'semantic-ui-react';

const FlexContainer = ({ children, className }) => (
  <Container className={`flex-container ${className}`}>
    {children}
  </Container>
);

FlexContainer.propTypes = {
  children: PropTypes.oneOfType(
    [
      PropTypes.node.isRequired,
      PropTypes.arrayOf(PropTypes.node)
    ]
  ).isRequired,
  className: PropTypes.string
};

FlexContainer.defaultProps = {
  className: ''
};

export default FlexContainer;
