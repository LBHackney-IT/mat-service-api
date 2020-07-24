import React from 'react';
import { Header, PhaseBanner, Container } from 'lbh-frontend-react';

const Layout: React.FC = (props: any) => {

    const feedbackLink = process.env.FEEDBACK_LINK ? process.env.FEEDBACK_LINK : "";

    return (
        <div>
            <Header serviceName="Manage A Tenancy" />
            <Container>
                <PhaseBanner phase="BETA" url={feedbackLink} />
                {props.children}
            </Container>
        </div>
    );
}

export default Layout;
