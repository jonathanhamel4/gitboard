import React from 'react';
import {
  Segment, Container, Header, Menu, Icon
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <Segment inverted padded="very" className="landing-segment">
      <Container text>
        <Header inverted as="h1">
          <Icon name="lock" />
        </Header>
        <Header inverted as="h4">
                You need to login to GitHub and authorize the integration first
        </Header>
        <Menu.Item as={Link} to="/">Go back to home</Menu.Item>
      </Container>
    </Segment>
  );
}
