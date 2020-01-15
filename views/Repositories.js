import React, { useState, useEffect } from 'react';
import AsyncDropdown from '../components/Dropdown';
import { Container, Segment, Card } from 'semantic-ui-react';
import RepoCard from '../components/RepoCard';
import getFetch from "../utils/fetch";

export default function Repositories() {
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [orgRepositories, setOrgRepositories] = useState([]);
    const [error, setError] = useState(null);

    function chunkArray(myArray, chunk_size){
        const tempArray = [];
        
        for (let index = 0; index < myArray.length; index += chunk_size) {
            const myChunk = myArray.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }
    
        return tempArray;
    }

    async function fetchOrgRepositories() {
        const {data, err} = await getFetch(`/orgs/${selectedOrganization}/repos`);
        const chunkedData = chunkArray(data, 3);

        setError(err);
        setOrgRepositories(chunkedData);
    }

    useEffect(() => {
        if (selectedOrganization !== null) {
            fetchOrgRepositories();
        }
    }, [selectedOrganization]);

    return (
        <Container className="push-down-header">
            <Segment>
                <AsyncDropdown defaultText="Select an organization" source="/orgs" onChangeCb={setSelectedOrganization} />
            </Segment>
            {orgRepositories.map((chunk, chunkIdx) => (
                <Card.Group key={chunkIdx}>
                    {chunk.map((repo, idx) => <RepoCard repo={repo} key={idx} />)}
                </Card.Group>
            ))}
        </Container>
    )
}