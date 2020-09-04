import React, {useState, useEffect } from 'react';
import Layout from '../components/layout';
import { Heading, HeadingLevels, List, ListTypes } from 'lbh-frontend-react';
import { TRAdetails } from '../interfaces/tra'
import getTRAs from '../usecases/ui/getTRAs';

export default function TRAs()
{
    const [traDetails, setTRAs] = useState<TRAdetails>(
        {
            tras: [],
            officername: "",
            patchname: ""
        });

    useEffect(() => {
        const fetchTRAdetails = async () => {
            const fetchedTRAdetails = await getTRAs(); 
            setTRAs(fetchedTRAdetails);
        }
        fetchTRAdetails();
    }, [])

    return (
        <Layout>
            <div className="lbh-container">
                <Heading level={HeadingLevels.H1}>Tenant and Resident Associations</Heading>
                <Heading level={HeadingLevels.H2}>TRAs for patch {traDetails.patchname}: {traDetails.officername}</Heading>
                <List
                    type={ListTypes.Bullet}
                    items={traDetails.tras.map((tra) => 
                        <>{tra.name}</>,
                    )}    
                />
            </div>
        </Layout>
    );
}