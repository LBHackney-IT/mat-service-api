import React, {useState, useEffect } from 'react';
import Layout from '../components/layout';
import { Heading, HeadingLevels, List, ListTypes } from 'lbh-frontend-react';
import { TRA } from '../interfaces/tra'
import getTRAs from '../usecases/ui/getTRAs';

export default function TRAs()
{
    const [tras, setTRAs] = useState<TRA[]>([]);
    useEffect(() => {
        const fetchTRAs = async () => {
            const hardCodedPatchId = "a739aa44-8553-e811-8126-70106faaf8c1";
            const fetchedTRAs = await getTRAs(hardCodedPatchId); 
            setTRAs(fetchedTRAs);
        }
        fetchTRAs();
    }, [])

    return (
        <Layout>
            <div className="lbh-container">
                <Heading level={HeadingLevels.H1}>Tenant and Resident Associations</Heading>
                <Heading level={HeadingLevels.H2}>TRAs for patch SN4: Anne James</Heading>

                <List
                    type={ListTypes.Bullet}
                    items={tras.map((tra) => 
                        <>{tra.name}</>,
                    )}    
                />
            </div>
        </Layout>
    );
}