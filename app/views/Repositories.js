import React, { useState, useEffect } from 'react';
import {
  Container, Segment, Card, Button, Checkbox, Divider
} from 'semantic-ui-react';
import { toast } from 'react-semantic-toasts';

import AsyncDropdown from '../components/Dropdown';
import RepoCard from '../components/RepoCard';
import getFetch from '../utils/fetch';
import SideFilter from '../components/SideFilter';

export default function Repositories() {
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [onlyUserRepo, setOnlyUserRepo] = useState(false);

  const [orgRepositories, setOrgRepositories] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);

  function handleError(err, msg) {
    if (err) {
      toast({
        type: 'error', icon: 'warning circle', title: 'Error', description: msg, animation: 'bounce', time: 5000
      });
      console.log(err);
      return true;
    }
    return false;
  }


  function updateQueryString() {
    const qsParams = new URLSearchParams(window.location.search);
    function updateParam(param, value) {
      if (value === null || value === false) qsParams.delete(param);
      else qsParams.set(param, value.toString());
    }
    updateParam('org', selectedOrganization);
    updateParam('team', selectedTeam);
    updateParam('userOnly', onlyUserRepo);
    const currentUrl = `${window.location.origin + window.location.pathname}?${qsParams.toString()}`;
    window.history.pushState('', '', currentUrl);
  }


  function onChangeOrg(value) {
    setSelectedOrganization(value);
    setSelectedTeam(null);
    setOnlyUserRepo(false);
  }

  function onChangeTeam(value) {
    setSelectedTeam(value);
    setOnlyUserRepo(false);
  }

  function onChangeUser(checked) {
    setOnlyUserRepo(checked);
    setSelectedTeam(null);
    setSelectedOrganization(null);
  }

  async function fetchOrgRepositories() {
    const { data, err } = await getFetch(`/orgs/${selectedOrganization}/repos?sort=full_name&withPull`);
    if (handleError(err, 'Error fetching organization repositories')) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  async function fetchOrgTeamRepositories() {
    const { data, err } = await getFetch(`/teams/${selectedTeam}/repos?sort=full_name&withPull`);
    if (handleError(err, 'Error fetching team repositories')) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  async function fetchUserRepositories() {
    const { data, err } = await getFetch('/repos/user?sort=full_name&withPull');
    if (handleError(err, 'Error fetching your repositories')) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  function onSearch() {
    setOrgRepositories([]);
    updateQueryString();
    if (onlyUserRepo) {
      fetchUserRepositories();
    } else if (selectedTeam) {
      fetchOrgTeamRepositories();
    } else if (selectedOrganization) {
      fetchOrgRepositories();
    }
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setSelectedOrganization(queryParameters.get('org'));
    setSelectedTeam(!queryParameters.get('team') || Number.isNaN(queryParameters.get('team')) ? null : parseInt(queryParameters.get('team'), 10));
    setOnlyUserRepo(!!queryParameters.get('userOnly'));
  }, []);

  return (
    <Container className="push-down-header min-height-100">
      <Segment className="filter-segment">
        <div>
          <Checkbox checked={onlyUserRepo} label="My repositories" onChange={(e, { checked }) => onChangeUser(checked)} />
        </div>
        <div className="relative-divider-segment">
          <Divider vertical>OR</Divider>
        </div>
        <AsyncDropdown
          defaultText="Select an organization"
          fetchData
          source="/orgs"
          value={selectedOrganization}
          onChangeCb={onChangeOrg}
          keyProp="id"
          textProp="login"
          valueProp="login"
          errorMessage="Could not fetch organizations"
        />
        <AsyncDropdown
          disabled={!selectedOrganization}
          defaultText="Select a team"
          fetchData={selectedOrganization}
          source={`/orgs/${selectedOrganization}/teams`}
          onChangeCb={onChangeTeam}
          value={selectedTeam}
          keyProp="id"
          textProp="name"
          valueProp="id"
          errorMessage="Could not fetch teams"
        />

        <Button onClick={onSearch}>Search</Button>
      </Segment>
      <div className="flex-filters-layout">
        <SideFilter repos={orgRepositories} orderedReposCb={setFilteredRepositories} />
        <div>
          <Card.Group itemsPerRow={3} stackable centered>
            {filteredRepositories.map((repo) => <RepoCard repo={repo} key={repo.id} />)}
          </Card.Group>
        </div>
      </div>

    </Container>
  );
}
