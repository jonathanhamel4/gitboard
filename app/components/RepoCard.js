import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card, Modal, Button, Header, Label
} from 'semantic-ui-react';
import Markdown from 'markdown-to-jsx';

const RepoCard = ({ repo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openPulls = (repo.pulls && repo.pulls.length && repo.pulls.filter((p) => !p.closed_at)) || [];
  const pullCount = openPulls.length;

  const shouldRaise = openPulls && openPulls.some((p) => moment().diff(moment(p.created_at), 'days') > 7);

  function showPulls() {
    setIsModalOpen(true);
  }

  function getRequestedReviewers(pull) {
    if (pull.requested_reviewers && pull.requested_reviewers.length) {
      return pull.requested_reviewers.map((r) => <Label key={r.id} color="blue">{r.login}</Label>);
    }
    return null;
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
            {!!openPulls.length && openPulls.map((pull) => (
              <Card key={pull.id} fluid>
                <Card.Content header={pull.title} as="a" href={pull.html_url} target="__blank" />
                <Card.Content extra>
                  <span>{`${pull.user.login} created ${moment(pull.created_at).fromNow()}`}</span>
                  {getRequestedReviewers(pull)}
                </Card.Content>
                {/* <Card.Content meta={`${pull.user.login} created ${moment(pull.created_at).fromNow()}`} />
                <Card.Content meta={`${pull.user.login} created ${moment(pull.created_at).fromNow()}`} /> */}
                <Card.Content description={<Markdown>{pull.body || ''}</Markdown>} />
                {pull.updated_at && <Card.Content extra>{`Updated ${moment(pull.updated_at).fromNow()}`}</Card.Content>}
              </Card>
            ))}
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
