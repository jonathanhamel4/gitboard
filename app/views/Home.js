import React from 'react';
import {
  Icon, Header, Divider
} from 'semantic-ui-react';
import Landing from '../components/Landing';
import FlexContainer from '../components/FlexContainer';

export default function Home() {
  return (
    <>
      <Landing />
      <FlexContainer className="main-flex-container">
        <Icon name="list alternate outline" />
        <div>
          <Header as="h2">No repository is missed</Header>
          <p>
            All your organizations and personal repositories are layed out in a searchable and filterable interface.
            You can easily search all your personal repositories or find public and private repositories for your organizations and teams.
          </p>
        </div>
      </FlexContainer>
      <Divider fitted section />
      <FlexContainer className="main-flex-container">
        <div>
          <Header as="h2">Keep projects alive</Header>
          <p>
            Easily find projects that have not been active in a long time. The Pushed and Updated filters allow to identify quickly the activity on repositories of an organization.
          </p>
        </div>
        <Icon name="clipboard check" />
      </FlexContainer>
      <Divider fitted section />
      <FlexContainer className="main-flex-container">
        <Icon name="bullseye" />
        <div>
          <Header as="h2">Find Pull Requests that need attention</Header>
          <p>
            The dynamic view will highlight any repository that is having a pull request dated by more than a week.
            The side panel filters allow for easy identification of repositories with pull active requests for your organization and team.
          </p>
        </div>
      </FlexContainer>
    </>
  );
}
