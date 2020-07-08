import * as React from 'react';

export interface Props {
	name: string;
	greeting: string;
}

function getTenancies(name: string) {
	return (name === 'Matt') ? 3 : 0;
}

function Hello({ name, greeting }: Props) {

	return (
		<div className="hello">
			{greeting} {name}, you have {getTenancies(name)} tenancies!
		</div>
	);
}

export default Hello;
