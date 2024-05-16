import { Logo } from '@/components/Logo';
import { CollectionEntry } from 'astro:content';
import { ComponentProps, PropsWithChildren } from 'react';

interface OpenGraphImageProps {
	post: CollectionEntry<'blog'>;
}

export function OpenGraphImage({ post }: OpenGraphImageProps) {
	const backgroundImage =
		'linear-gradient(111.1deg, rgb(0, 40, 70) -4.8%, rgb(255, 115, 115) 82.7%, rgb(255, 175, 123) 97.2%)';

	return (
		<Flex
			style={{
				width: '100%',
				height: '100%',
				padding: '2rem',
				color: 'white',
				fontSize: '24px',
				backgroundImage
			}}
		>
			<div style={{ height: '1rem' }} />
			<Header />
			<Footer>
				<Title>{post.data.title}</Title>
				<div style={{ height: '1rem' }} />
				<Description>{post.data.description}</Description>
			</Footer>
		</Flex>
	);
}

function Header() {
	return (
		<h2 style={{ margin: 0 }}>
			<Logo />
		</h2>
	);
}

function Footer({ children }: PropsWithChildren) {
	return <Flex style={{ marginTop: 'auto' }}>{children}</Flex>;
}

function Title({ children }: PropsWithChildren) {
	return <h1 style={{ display: 'block', textWrap: 'balance', marginBottom: 0 }}>{children}</h1>;
}

function Description({ children }: PropsWithChildren) {
	return <p style={{ display: 'block', textWrap: 'balance', maxWidth: '80%' }}>{children}</p>;
}

function Flex({ style, ...props }: ComponentProps<'div'>) {
	return <div {...props} style={{ flexDirection: 'column', ...style, display: 'flex' }} />;
}
