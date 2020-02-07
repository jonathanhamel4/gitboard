import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Dropdown, Header, Checkbox, Divider, Label
} from 'semantic-ui-react';

const sortDirections = [{ key: 'asc', text: 'ASC', value: 1 }, { key: 'desc', text: 'DESC', value: -1 }];
const sortOrders = [
  { key: 'created', text: 'Created', value: 'created_at' },
  { key: 'name', text: 'Name', value: 'name' },
  { key: 'pushed', text: 'Pushed', value: 'pushed_at' },
  { key: 'updated', text: 'Updated', value: 'updated_at' }
];

const SideFilter = ({ repos, orderedReposCb }) => {
  // Dropdown options
  const [owners, setOwners] = useState([]);
  const [repoList, setRepoList] = useState([]);

  // Filters
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState(1);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [hasPulls, setHasPulls] = useState(false);
  const [org, setOrg] = useState(null);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [selectedPrMember, setSelectedPrMember] = useState(null);

  // Metadata
  const [count, setCount] = useState(0);


  const [prByMember, setPrByMember] = useState([]);


  function calculatePRsByMember() {
    const prs = {};
    if (repos && repos.length) {
      repos.forEach((repo) => {
        if (repo.pulls && repo.pulls.length) {
          repo.pulls.forEach((pull) => {
            pull.requested_reviewers.forEach((reviewer) => {
              prs[reviewer.login] = (prs[reviewer.login] || []);
              prs[reviewer.login].push(repo.name);
            });
          });
        }
      });
    }
    const sortedKeys = Object.keys(prs).sort();
    setPrByMember(sortedKeys.map((k) => ({
      key: k, value: k, text: k, description: prs[k].length, data: prs[k]
    })));
  }


  useEffect(() => {
    const filteredOwners = Array.from(new Set(repos.map((r) => r.owner.login))).map((r) => ({ key: r, value: r, text: r }));
    filteredOwners.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    setOwners(filteredOwners);

    const filteredRepos = Array.from(new Set(repos.map((r) => r.name))).map((r) => ({ key: r, value: r, text: r }));
    filteredRepos.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    setRepoList(filteredRepos);

    calculatePRsByMember();
    if (!repos || !repos.length) {
      setSelectedRepos([]);
      setOrg(null);
    }
  }, [repos]);


  useEffect(() => {
    if (repos && repos.length) {
      let reposFiltered = JSON.parse(JSON.stringify(repos));

      if (selectedPrMember) {
        const reposToFilter = new Set(prByMember.find((m) => selectedPrMember === m.key).data);
        reposFiltered = reposFiltered.filter((r) => reposToFilter.has(r.name));
      }

      if (!isPrivate) {
        reposFiltered = reposFiltered.filter((r) => !r.private);
      }

      if (!isPublic) {
        reposFiltered = reposFiltered.filter((r) => r.private);
      }

      if (hasPulls) {
        reposFiltered = reposFiltered.filter((r) => r.pulls && r.pulls.length > 0);
      }

      if (org) {
        reposFiltered = reposFiltered.filter((r) => r.owner.login === org);
      }

      if (selectedRepos && selectedRepos.length) {
        reposFiltered = reposFiltered.filter((r) => selectedRepos.includes(r.name));
      }

      if (sortBy) {
        const direction = sortDirection || 1;
        reposFiltered.sort((a, b) => a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()) * parseInt(direction, 10));
      }
      orderedReposCb(reposFiltered);
      setCount(reposFiltered.length);
    } else {
      setCount(0);
      orderedReposCb(repos);
    }
  }, [repos, sortBy, sortDirection, isPrivate, isPublic, hasPulls, org, selectedRepos, selectedPrMember]);

  return (
    <Segment>
      <Divider horizontal>
        <Header as="h5">
          Sort
        </Header>
      </Divider>
      <Dropdown
        clearable
        placeholder="Sort By..."
        selection
        options={sortOrders}
        value={sortBy}
        onChange={(e, { value }) => setSortBy(value)}
      />
      <Divider hidden />
      <Dropdown
        clearable
        placeholder="Sort Direction..."
        selection
        options={sortDirections}
        value={sortDirection}
        onChange={(e, { value }) => setSortDirection(value)}
      />
      <Divider horizontal>
        <Header as="h5">
          Filter
        </Header>
      </Divider>
      <Checkbox label="Private" checked={isPrivate} onChange={(e, { checked }) => setIsPrivate(checked)} />
      <Divider hidden />
      <Checkbox label="Public" checked={isPublic} onChange={(e, { checked }) => setIsPublic(checked)} />
      <Divider hidden />
      <Checkbox label="Has Pull Requests" checked={hasPulls} onChange={(e, { checked }) => setHasPulls(checked)} />
      <Divider hidden />
      <Dropdown
        search
        clearable
        placeholder="Organizations..."
        selection
        options={owners}
        noResultsMessage="No results"
        value={org}
        disabled={repos.length === 0}
        onChange={(e, { value }) => setOrg(value)}
      />
      <Divider hidden />
      <Dropdown
        search
        clearable
        placeholder="Repositories..."
        selection
        multiple
        options={repoList}
        noResultsMessage="No results"
        value={selectedRepos}
        disabled={repos.length === 0}
        onChange={(e, { value }) => setSelectedRepos(value)}
      />
      {prByMember && prByMember.length > 0 && (
        <>
          <Divider horizontal>
            <Header as="h5">
              Pull Requests
            </Header>
          </Divider>
          <Dropdown
            search
            clearable
            placeholder="Lookup user PRs..."
            selection
            options={prByMember}
            noResultsMessage="No results"
            value={selectedPrMember}
            disabled={repos.length === 0}
            onChange={(e, { value }) => setSelectedPrMember(value)}
          />
        </>
      )}
      <Divider hidden />
      <Label color={count === repos.length ? 'grey' : 'blue'}>
        {`Showing ${count} of ${repos.length} results`}
      </Label>
    </Segment>
  );
};

SideFilter.propTypes = {
  repos: PropTypes.array.isRequired,
  orderedReposCb: PropTypes.func.isRequired
};

export default SideFilter;
