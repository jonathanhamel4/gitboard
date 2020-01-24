import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  Segment, Container, Menu, Form
} from 'semantic-ui-react';

export default function Navigation() {
  const currentUser = document.getElementById('username').value;
  const matchRepo = useRouteMatch({ path: '/repo', strict: true, sensitive: true });

  return (
    <Segment as="header" inverted vertical>
      <Container>
        <Menu pointing inverted secondary size="large">
          <Menu.Item as={Link} to="/" active={!matchRepo}>GitBoard</Menu.Item>
          <Menu.Item as={Link} to="/repo" active={!!matchRepo}>Repositories</Menu.Item>
          {currentUser && (
            <Menu.Menu position="right">
              <Menu.Item>{currentUser}</Menu.Item>
              <Menu.Item style={{ padding: 0 }}>
                <Form method="post" action="/oauth/logout">
                  <Form.Button inverted type="submit">Logout</Form.Button>
                </Form>
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
      </Container>
    </Segment>
  );
}
