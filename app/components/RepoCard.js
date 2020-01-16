import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card, Modal, Button, List, Header, Label, Divider, Segment
} from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

const RepoCard = ({ repo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openPulls = (repo.pulls && repo.pulls.length && repo.pulls.filter((p) => !p.closed_at)) || [];
  const pullCount = openPulls.length;

  const shouldRaise = openPulls && openPulls.some((p) => moment().diff(moment(p.created_at), 'days') > 7);

  function showPulls() {
    setIsModalOpen(true);
  }

  return (
    <Card color={shouldRaise ? 'red' : 'grey'}>
      <Card.Content>
        <Card.Header>{repo.name}</Card.Header>
        <Card.Meta>
          <a href={repo.html_url} target="__blank">
            {`GitHub: ${repo.full_name}`}
          </a>
        </Card.Meta>
        <Card.Description>
          {repo.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          onClick={showPulls}
          color="blue"
          content="Pulls"
          label={{
            as: 'p',
            content: pullCount,
            color: pullCount ? 'red' : 'blue',
            pointing: 'left'
          }}
        />
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Modal.Header>Pull Requests</Modal.Header>
          <Modal.Content>
            {!openPulls.length && <Header as="h3">All good, no pull requests</Header>}
            {!!openPulls.length && (
              <List divided relaxed="very" size="large">
                {openPulls.map((pull) => (
                  <List.Item key={pull.id}>
                    <List.Content>
                      <List.Header as="a" href={pull.html_url} target="__blank">{pull.title}</List.Header>
                      <List.Description>
                        <Header sub>
                          Created
                          {moment(pull.created_at).fromNow()}
                        </Header>
                        {pull.updated_at && (
                        <Header sub>
                          Updated
                          {moment(pull.updated_at).fromNow()}
                        </Header>
                        )}
                        <Divider hidden />
                        <Header sub>
                          Reviewers:
                          {pull.requested_reviewers.map((r) => <Label key={r.id} content={r.login} />)}
                        </Header>
                        {pull.body && <Segment><ReactMarkdown source={pull.body} /></Segment>}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            )}
          </Modal.Content>
        </Modal>
      </Card.Content>
    </Card>
  );
};

RepoCard.propTypes = {
  repo: PropTypes.shape({
    description: PropTypes.string,
    html_url: PropTypes.string,
    full_name: PropTypes.string,
    name: PropTypes.string,
    pulls: PropTypes.array
  }).isRequired
};


export default RepoCard;
