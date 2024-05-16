import { ComponentProps } from 'react';

export function Logo() {
	const arrowColor = 'rgb(107 114 128)';
	const margin = '0.5em';

	return (
		<Row>
			<span style={{ color: arrowColor, marginRight: margin }}>{'<'}</span>
			Alan<span style={{ color: 'rgb(234 88 12)', marginRight: margin }}>'s</span> Notes
			<span style={{ color: arrowColor, marginLeft: margin }}>{'>'}</span>
		</Row>
	);
}

function Row({ style, ...props }: ComponentProps<'div'>) {
	return <div {...props} style={{ ...style, display: 'flex', flexDirection: 'row' }} />;
}
