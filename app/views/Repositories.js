import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Container, Segment, Card, Button, Checkbox, Divider, Loader, Label
} from 'semantic-ui-react';

import AsyncDropdown from '../components/Dropdown';
import RepoCard from '../components/RepoCard';
import { getFetch } from '../utils/fetch';
import SideFilter from '../components/SideFilter';
import urls from '../apiUrls';

export default function Repositories() {
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [onlyUserRepo, setOnlyUserRepo] = useState(false);

  const [orgRepositories, setOrgRepositories] = useState([]);
  const [filteredRepositories, setFilteredRepositories] = useState([]);
  const [updateTime, setUpdateTime] = useState(null);

  function clearAndSetNewIntervalId(id = null) {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
    }
    setIntervalId(id);
  }

  function setFetchInterval(cb) {
    // Run the callback every 10 minutes (refresh the data)
    const interval = window.setInterval(cb, 600000);
    clearAndSetNewIntervalId(interval);
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
    const { data, isError } = await getFetch(urls.orgs.repos(selectedOrganization), 'Error fetching organization repositories');
    if (isError) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  async function fetchOrgTeamRepositories() {
    const { data, isError } = await getFetch(urls.teams.repos(selectedTeam), 'Error fetching team repositories');
    if (isError) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  async function fetchUserRepositories() {
    const { data, isError } = await getFetch(urls.user.repos, 'Error fetching your repositories');
    if (isError) {
      setOrgRepositories([]);
      return;
    }
    setOrgRepositories(data);
  }

  async function onSearch() {
    setIsLoading(true);
    setOrgRepositories([]);
    updateQueryString();
    if (onlyUserRepo) {
      setFetchInterval(fetchUserRepositories);
      await fetchUserRepositories();
    } else if (selectedTeam) {
      setFetchInterval(fetchOrgTeamRepositories);
      await fetchOrgTeamRepositories();
    } else if (selectedOrganization) {
      setFetchInterval(fetchOrgRepositories);
      await fetchOrgRepositories();
    } else {
      clearAndSetNewIntervalId(null);
    }
    setIsLoading(false);
    setUpdateTime(moment().format('HH:mm'));
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setSelectedOrganization(queryParameters.get('org'));
    setSelectedTeam(!queryParameters.get('team') || Number.isNaN(queryParameters.get('team')) ? null : parseInt(queryParameters.get('team'), 10));
    setOnlyUserRepo(!!queryParameters.get('userOnly'));

    // cleanup the auto-refresh on componentWillUnmount
    return () => clearAndSetNewIntervalId(null);
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
        <div>
          <Button onClick={onSearch}>Search</Button>
          {updateTime && (<Label color="grey" floating>{updateTime}</Label>)}
        </div>

      </Segment>
      <Loader size="large" active={isLoading}>Loading Repositories...</Loader>
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
