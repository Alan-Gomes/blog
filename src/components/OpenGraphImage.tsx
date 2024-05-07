import { CollectionEntry } from 'astro:content';
import { ComponentProps, PropsWithChildren } from 'react';

interface OpenGraphImageProps {
	post: CollectionEntry<'blog'>;
}

export function OpenGraphImage({ post }: OpenGraphImageProps) {
	const backgroundImage = 'linear-gradient(60deg, #29323c 0%, #485563 100%)';

	return (
		<Flex
			style={{ width: '100%', height: '100%', padding: '2rem', color: 'white', backgroundImage }}
		>
			<Header />
			<Footer>
				<Title>{post.data.title}</Title>
				<Description>{post.data.description}</Description>
			</Footer>
		</Flex>
	);
}

function Header() {
	const arrowColor = 'rgb(107 114 128)';
	const margin = '0.5rem';

	return (
		<h2 style={{ margin: 0 }}>
			<span style={{ color: arrowColor, marginRight: margin }}>{'<'}</span>
			Alan<span style={{ color: 'rgb(234 88 12)', marginRight: margin }}>'s</span> Notes
			<span style={{ color: arrowColor, marginLeft: margin }}>{'>'}</span>
		</h2>
	);
}

function Footer({ children }: PropsWithChildren) {
	return <Flex style={{ marginTop: 'auto' }}>{children}</Flex>;
}

function Title({ children }: PropsWithChildren) {
	return (
		<h1 style={{ display: 'block', textOverflow: 'ellipsis', lineClamp: 1, marginBottom: 0 }}>
			{children}
		</h1>
	);
}

function Description({ children }: PropsWithChildren) {
	return (
		<h3 style={{ display: 'block', textOverflow: 'ellipsis', lineClamp: 2, maxWidth: '80%' }}>
			{children}
		</h3>
	);
}

function Flex({ style, ...props }: ComponentProps<'div'>) {
	return <div {...props} style={{ flexDirection: 'column', ...style, display: 'flex' }} />;
}
