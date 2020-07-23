import React from 'react';
import { Header } from 'lbh-frontend-react';

const Layout: React.FC = (props: any) => {

    return (
        <div>
            <Header serviceName="Manage A Tenancy" />
            {/* <PhaseBanner phase="BETA" /> */}
            <main className="lbh-main-wrapper" id="main-content">
                {props.children}
            </main>
        </div>
    );
}

export default Layout;
