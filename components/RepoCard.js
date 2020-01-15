import React from "react";
import { Card } from "semantic-ui-react";

export default function RepoCard({repo}) {
    return (
        <Card>
            <Card.Content>
                <Card.Header>{repo.name}</Card.Header>
                <Card.Meta><a href={repo.html_url}>GitHub: {repo.full_name}</a></Card.Meta>
                <Card.Description>
                    {repo.description}
                </Card.Description>
            </Card.Content>
        </Card>
    )
}