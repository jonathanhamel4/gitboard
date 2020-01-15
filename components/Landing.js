import React from "react";
import { Container, Header, Segment, Form } from "semantic-ui-react";
import { Link } from "react-router-dom";


export default function Landing() {
    const appAlreadyInstalled = document.getElementById("appInstalled").value === "true";
    return (
        <Segment inverted padded='very' className="landing-segment">
            <Container text>
                <Header inverted as='h1'>
                    Welcome to GitBoard!
                </Header>
                {appAlreadyInstalled && (
                    <p>App already installed. Click the button to refresh permissions or jump to <Link to="/repo">Repositories</Link></p>
                )}
                <Form method="post" action="/oauth/install">
                    <Form.Button inverted type="submit">Add Gitboard to GitHub</Form.Button>
                </Form>
            </Container>
        </Segment>
    )
}
