---
layout: ../../layouts/post.astro
title: 'Aplicando o conceito Single Source of Truth em componentes React'
pubDate: 2024-05-05
description: 'Como escrever componentes mais fáceis de manter e mais simples de entender.'
author: 'Alan Gomes'
excerpt: Neste artigo irei explicar o que é _Single Source of Truth_ e como ele pode ser utilizado para prevenir possíveis bugs e ainda melhorar a legibilidade dos seus componentes.
image:
  src:
  alt:
tags: ['react', 'javascript', 'typescript', 'patterns']
---

Neste artigo irei explicar o que é _Single Source of Truth_ e como ele pode ser utilizado para prevenir possíveis bugs e ainda melhorar a legibilidade dos seus componentes.

_Single Source of Truth_ (ou SSOT) é uma prática de estruturar as informações em sua aplicação de forma que haja um ponto central, que é o estado em si, e ramificações desse estado, que são derivações da informação contida no estado. Em termos simples, o SSOT refere-se a ter um único local onde o estado da aplicação é armazenado. Em vez de espalhar o estado por diferentes partes do código, você centraliza todas as informações relevantes em um único ponto. Isso oferece várias vantagens:

- **Consistência:** Quando há apenas um local para atualizar o estado, você evita inconsistências e erros. Todos os componentes que dependem desse estado sempre verão a versão mais recente.
- **Facilidade de Manutenção:** Com um SSOT, a manutenção se torna mais simples. Você não precisa rastrear várias fontes de dados ou se preocupar com conflitos entre diferentes estados.
- **Previsibilidade:** O SSOT torna o fluxo de dados mais previsível. Você sabe exatamente de onde vêm os dados e como eles são atualizados.

## Eliminando estados desnecessários nos componentes

O primeiro passo para entender o SSOT é saber o que é e como desenvolver estados centralizados. Para compreender melhor o conceito aplicado no contexto de componentes React, vamos primeiro dar uma olhada no exemplo abaixo:

```tsx showLineNumbers {3-4}
const fruits = [/*...*/];
function FruitList() {
	const [query, setQuery] = useState('');
	const [filteredFruits, setFilteredFruits] = useState(fruits);

	const filter = (newQuery: string) => {
		setQuery(newQuery);
		setFilteredFruits(filteredFruits.filter(fruit => !query || fruit.name.includes(query)))
	};

	return (
		<>
			<input
				value={query}
				onChange={(event) => {
					const newValue = event.target.value;
					filter(newValue);
				}}
			/>
			{fruits.map(fruit => <Fruit key={fruit.id} fruit={fruit}>)}
		</>
	);
}
```

> **Atenção!** Essa não é forma recomendada de implementar esses tipos de funcionalidades, o código utilizado aqui é apenas para fins de demonstração.

O componente `FruitList` possui dois estados: `query` e `filteredFruits`. O primeiro estado guarda o texto que o usuário digitou e o segundo guarda a lista de frutas filtrada pelo texto. A primeira vista o código aparenta não ter problemas, entretanto conforme são implementadas mais regras algumas dificuldades começam a aparecer.

Vamos fazer um ajuste no componente e adicionar um botão para limpar a pesquisa. Uma funcionalidade relativamente simples:

```tsx showLineNumbers {11-13,24}
const fruits = [/*...*/];
function FruitList() {
	const [query, setQuery] = useState('');
	const [filteredFruits, setFilteredFruits] = useState(fruits);

	const filter = (newQuery: string) => {
		setQuery(newQuery);
		setFilteredFruits(fruits.filter(fruit => !query || fruit.name.includes(query)));
	};

	const clear = () => {
		setQuery('');
	};

	return (
		<>
			<input
				value={query}
				onChange={(event) => {
					const newValue = event.target.value;
					filter(newValue);
				}}
			/>
			<button onClick={clear}>limpar</button>
			{fruits.map(fruit => <Fruit key={fruit.id} fruit={fruit}>)}
		</>
	);
}
```

Após implementar a funcionalidade já nos deparamos com o primeiro problema: o campo de texto foi limpo, porém os resultados seguem filtrados. Algumas das soluções possíveis para o problema seriam:

- Adicionar outro `setFilteredFruits` dentro de `clear` para reiniciar a lista sem o filtro aplicado
- Reutilizar a função `filter` passando um valor vazio
- Mover o `setFilteredFruits` para dentro de um `useEffect`

Todas essas abordagens seguem o caminho de tentar sincronizar os estados `query` e `filteredFruits`. Em ambos os casos a solução seria trivial: uma linha de código e o trabalho está feito. Entretanto, conforme novas regras de negócio são adicionadas e a complexidade do projeto cresce, a sincronização de estados passa a se tornar mais difícil e consequentemente começa a ser a causa raiz de muitos bugs.

Vamos analisar outro exemplo do mesmo componente com o código refatorado, restando apenas um estado que é a fonte única da verdade:

```tsx showLineNumbers {4,7}
const fruits = [/*...*/];
function FruitList() {
	const [query, setQuery] = useState('');
	const filteredFruits = fruits.filter(fruit => !query || fruit.name.includes(query));

	const filter = (newQuery: string) => {
		setQuery(newQuery);
	};

	const clear = () => {
		setQuery('');
	};

	return (/* omitido por brevidade */);
}
```

Agora nesse exemplo a variável `filteredFruits`, que antes era um estado por si só, tornou-se apenas o resultado de uma expressão baseada no estado `query`. Dessa forma, temos a garantia de que o valor de `filteredFruits` sempre estará de acordo com o valor de `query`, sem necessidade de nenhuma sincronização.

> _"Mas e a performance?"_\
> \
> Vamos lembrar da famosa frase: "otimização prematura é a raíz de todo mal". \
> No exemplo exibido temos uma lista que possui poucos itens dentro de um componente que será renderizado apenas quando o filtro mudar. \
> Prefira o código simples e legível e apenas otimize se você tem meios de afirmar que aquela otimização se faz necessária. Mesmo em manipulação de arrays o custo de performance as vezes é negligível. Caso seja realmente necessário, o hook `useMemo` pode ser utilizado para que a expressão não impacte em termos de performance.

## Aplicando SSOT entre dois ou mais componentes

O conceito SSOT não se limita apenas a um componente, você pode e deve pensar a centralização dos estados através de sua aplicação. Os benefícios são os mesmos, porém é necessário pensar nas abordagens possíveis e qual a ideal para seu caso de uso.

### Primeira abordagem: Estado via props

A abordagem mais prática é simplesmente passar o estado via props. O componente pai possui o estado e fornece o valor atual via prop para os componentes filhos. Os componentes filhos, por sua vez, chamam callbacks para comunicar que desejam atualizar o valor do estado e o componente pai processa a solicitação.

```tsx
function FruitList() {
	const [query, setQuery] = useState('');

	const filter = (newQuery: string) => {
		setQuery(newQuery);
	};

	return (
		<>
			<SearchBox value={query} onChange={filter} />
			{/* omitido por brevidade */}
		</>
	);
}

function SearchBox({ query, onChange }) {
	// o componente filho não altera o estado diretamente,
	// em vez disso, chama o onChange para indicar a intenção de fazer a alteração

	// a propriedade não poderia se chamar "setQuery"?
	// não, a nome "onChange" é proposital para essa intenção no código.
	// "set" indica algo imperativo, "onXXX" indica uma notificação,
	// sem necessariamente uma alteração de estado
	return <input value={query} onChange={({ target }) => onChange(target.value)} />;
}
```

> Essa abordagem também é conhecida como _componentes controlados_.

Essa forma de passar o estado adiante tem pontos positivos e negativos. Alguns pontos positivos:

- É simples e prático, utiliza props simples do React.
- O fluxo dos dados no código fica mais claro.
- O componente é facilmente reutilizável, já que as props podem ser substituídas a vontade.

Alguns pontos negativos:

- O código começa a ficar repetitivo quando o estado precisa ser passado para mais componentes, principalmente componentes dentro de outros componentes, o famoso _prop drilling_.
- O valor pode fazer um longo caminho dentro dos componentes até chegar onde precisa.

### Segunda abordagem: estado via contexto

Existe outra abordagem que mitiga os pontos negativos de passar o estado através de props, utilizando contexto do React. O contexto pode ser utilizado para transmitir o valor de um estado com toda a árvore de componentes filhos, mantendo os mesmos sincronizados.

```tsx
const ThemeContext = createContext<'dark' | 'light'>('light');
function FruitList() {
	const [theme, setTheme] = useState('light');

	const toggle = () => {
		setTheme(theme === 'dark' ? 'dark' : 'light');
	};

	return (
		<ThemeContext.Provider value={theme}>
			<Header />
			{/* omitido por brevidade */}
		</ThemeContext.Provider>
	);
}

function Header() {
	const theme = useContext(ThemeContext);
	return <>o tema atual é {theme}</>;
}
```

Vamos analisar os pontos positivos dessa abordagem:

- Não é necessário adicionar props extras aos componentes.
- O componente que lê o estado pode estar em qualquer lugar dentro da árvore de componentes filhos, resolvendo o problema do _prop drilling_.
- O código fica relativamente mais limpo sem as props em cada componente.

Agora alguns pontos negativos:

- O fluxo dos dados pode não ficar tão claro no código.
- O componente só é reutilizável enquanto o contexto está disponível.

### Qual abordagem escolher?

É muito difícil definir uma regra geral de qual abordagem escolher em cada situação, pois cada problema tem suas especificidades, mas aqui vou deixar algumas recomendações:

Em componentes genéricos e reutilizáveis (componentes de design system, por exemplo), quando o objetivo é trafegar estado interno ou quando o estado abrange muitas partes do sistema, o recomendável é utilizar contexto.

Por exemplo, um componente de `TabBar` pode passar o estado da aba ativa para os componentes `Tab` filhos através de contexto, sem a necessidade de cada um deles receber essa informação via props.

```tsx
// o componente TabBar possui o estado da aba atual
<TabBar>
	<Tab>Aba 1</Tab>
	{/* o componente Tab sabe qual a aba ativa através de contexto */}
	<Tab>Aba 2</Tab>
	<Tab>Aba 3</Tab>
</TabBar>
```

Em componentes mais especializados ou quando o estado é externo, é recomendado utilizar props e _componentes controlados_:

```tsx
const [query, setQuery] = useState('');

// o componente SearchBox recebe o estado diretamente via props
return <SearchBox value={query} onChange={setQuery} >;
```

Mas como nada é preto no branco, existem situações onde ambas as abordagens possam ser aplicadas:

```tsx
const [tab, setTab] = useState(0);

// o componente TabBar recebe o estado diretamente via props
return (
	<TabBar current={tab} onChange={setTab}>
		{/* o componente Tab, por sua vez,
					recebe o mesmo estado através do contexto do TabBar */}
		<Tab>Aba 1</Tab>
		<Tab>Aba 2</Tab>
		<Tab>Aba 3</Tab>
	</TabBar>
);
```

Espero que esse artigo ajude você a escrever componentes mais fáceis de manter e consequentemente te poupe dor de cabeça no futuro. Até a próxima!
