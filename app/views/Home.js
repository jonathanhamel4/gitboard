import React, { useState } from 'react';
import { Icon, Header, Divider, Visibility, Transition } from 'semantic-ui-react';
import Landing from '../components/Landing';
import FlexContainer from '../components/FlexContainer';

const animation = 'fade right';
const duration = 1500;
export default function Home() {
  const [visible, setVisible] = useState(new Set());

  function animate(property) {
    const visibleCopy = new Set(visible);
    if (visibleCopy.has(property)) {
      visibleCopy.delete(property);
    } else {
      visibleCopy.add(property);
    }
    setVisible(visibleCopy);
  }

  return (
    <>
      <Landing />
      <Visibility once onTopVisible={() => animate('first')}>
        <Transition.Group animation="fade left" duration={duration}>
          {visible.has('first') && (
            <div>
              <FlexContainer className="main-flex-container">
                <Icon name="calendar alternate outline" />
                <div>
                  <Header as="h2">Some nice feature!!! (1)</Header>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                  </p>
                </div>
              </FlexContainer>
            </div>
          )}
        </Transition.Group>
      </Visibility>
      <Divider fitted section />
      <Visibility once onTopVisible={() => animate('second')}>
        <Transition.Group animation="fade right" duration={duration}>
          {visible.has('second') && (
            <div>
              <FlexContainer className="main-flex-container">
                <div>
                  <Header as="h2">Some nice feature!!! (2)</Header>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                  </p>
                </div>
                <Icon name="calendar alternate outline" />
              </FlexContainer>
            </div>
          )}
        </Transition.Group>
      </Visibility>
      <Divider fitted section />
      <Visibility once onTopVisible={() => animate('third')}>
        <Transition.Group animation="fade left" duration={duration}>
          {visible.has('third') && (
            <div>
              <FlexContainer className="main-flex-container">
                <Icon name="calendar alternate outline" />
                <div>
                  <Header as="h2">Some nice feature!!! (2)</Header>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                  </p>
                </div>
              </FlexContainer>
            </div>
          )}
        </Transition.Group>
      </Visibility>
    </>
  );
}
