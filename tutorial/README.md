# Introduction

## Motivation

React 내장 상태 관리는 다음과 같은 한계가 있다.

- 컴포넌트의 상태는 공통된 상위요소까지 끌어올림으로써 공유될 수 있지만, 이 과정에서 거대한 트리가 다시 렌더링되는 부작용을 낳을 수 있다.
- `Context`는 단일 값만 저장할 수 있으며, 자체 consumer를 가지는 여러 값들의 집합을 담을 수는 없다.
- 이 두가지 특성이 트리의 최상단(state가 존재하는 곳)부터 트리의 잎(state가 사용되는 곳)까지의 코드 분할을 어렵게한다.

React스러움을 유지하면서도 이러한 한계를 해주는 것이 Recoil의 주요 존재 의의일 것.

Recoil은 방향 그래프를 정의하고 React 트리에 붙인다. 상태 변화는 이 그래프의 뿌리(atoms)로부터 순수함수(selectors)를 거쳐 컴포넌트로 흐르며, 다음과 같은 접근 방식을 따른다.

- 공유 상태도 React의 로컬 상태처럼 간단한 get/set 인터페이스로 사용할 수 있도록 API를 제공한다. (필요한 경우 리듀서 등으로 캡슐화할 수도 있다.)
- 동시성 모드를 비롯한 새로운 React의 기능들과도 호환 가능성을 갖는다.
- 상태 정의는 증분 및 분산되므로 코드 분할이 가능하다.
- 상태를 사용하는 컴포넌트를 수정하지 않고도 상태를 파생된 데이터로 대체할 수 있다.
- 파생된 데이터를 사용하는 컴포넌트를 수정하지 않고도 파생된 데이터는 동기식과 비동기식 간에 이동할 수 있다.
- 탐색을 일급 개념으로 취급할 수 있고 링크에서 상태 전환을 인코딩할 수도 있다.
- 역호환성 방식으로 전체 앱 상태를 유지하여 유지된 상태는 앱 변경에도 살아남을 수 있다.

## Core Concepts

Recoil을 사용하면 atoms(공유 상태)에서 selectors(순수 함수)를 거쳐 React 컴포넌트로 내려가는 data-flow 그래프를 만들 수 있다. Atoms는 컴포넌트가 구독할 수 있는 상태의 단위다. Selectors는 atoms 상태값을 동기 혹은 비동기 방식으로 변환한다.

### Atoms

상태의 단위이며, 업데이트와 구독이 가능하다. atom이 업데이트되면 각각의 구독 컴포넌트는 새로운 값을 반영하여 재렌더링된다. atoms는 런타임에 생성될 수도 있다. 로컬 컴포넌트의 상태 대신 사용할 수 있다. 동일한 atom이 여러 컴포넌트에서 사용되는 경우 모든 컴포넌트는 상태를 공유한다.

Atoms는 `atom` 함수를 사용해 생성한다.

```js
const fontSizeState = atom({
  key: 'fontSizeState',
  default: 14,
});
```

Atoms는 디버깅, 지속성 및 모든 atoms의 맵을 볼 수 있는 특정 고급 API에 사용되는 고유한 키가 필요하다. 두 개의 다른 atom이 같은 키를 갖는 것은 오류이기 때문에 키 값은 전역적으로 고유하도록 해야한다. React 컴포넌트의 상태처럼 기본값(default)도 가진다.

컴포넌트에서 atom을 읽고 쓰려면 `useRecoilState` 훅을 사용한다. `useState`와 비슷하지만 상태가 컴포넌트 간에 공유될 수 있다는 차이가 있다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button onClick={() => setFontSize((size) => size + 1)} style={{fontSize}}>
      Click to Enlarge
    </button>
  );
}
```

버튼을 클릭하면 버튼의 글꼴 크기가 1씩 증가하며, `fontSizeState` `atom`을 사용하는 다른 컴포넌트의 글꼴 크기도 같이 변화한다. 

```js
function Text() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return <p style={{fontSize}}>This text will increase in size too.</p>;
}
```

## Selectors

atoms나 다른 selectors를 입력으로 받는 순수 함수다. 상위 atoms 또는 selectors가 업데이트 되면 하위 selectors 함수도 다시 실행된다. 컴포넌트들은 selectors를 atoms처럼 구독할 수 있으며 selectors가 변경되면 컴포넌트들도 다시 렌더링된다.

Selectors는 상태를 기반으로 하는 파생 데이터를 계산하는 데 사용된다. 최소한의 상태 집합만 atoms에 저장하고 다른 모든 파생되는 데이터는 selectors에 명시한 함수를 통해 효율적으로 계산함으로써 쓸모없는 상태의 보존을 방지한다.

Selectors는 어떤 컴포넌트가 자신이 필요한지, 또 자신은 어떤 상태에 의존하는지를 추적하기 때문에 이러한 함수적인 접근방식을 매우 효율적으로 만든다. 

컴포넌트 관점에서 보면 selectors와 atoms는 동일한 인터페이스를 가지므로 서로 대체할 수 있다.

Selectors는 `selector` 함수를 사용해 정의한다.

```js
const fontSizeLabelState = selector({
  key: 'fontSizeLabelState',
  get: ({get}) => {
    const fontSize = get(fontSizeState);
    const unit = 'px';

    return `${fontSize}${unit}`;
  },
});
```

`get` 속성은 계산될 함수다. 전달되는 `get` 인자를 통해 atoms와 다른 selectors에 접근할 수 있다. 다른 atoms나 selectors에 접근하면 자동으로 종속 관계가 생성되므로, 참조했던 atoms나 selectors가 업데이트되면 이 함수도 다시 실행된다.

위 예시에서 selector는 `fontSizeState`라는 하나의 atom에 의존성을 갖는다. 개념적으로 `fontSizeLabelState` selector는 `fontSizeState`를 입력으로 사용하고 형식화된 글꼴 크기 레이블을 출력으로 반환하는 순수 함수처럼 동작한다.

Selectors는 `useRecoilValue`를 사용해 읽을 수 있다. `useRecoilValue`는 하나의 atom이나 selector를 인자로 받아 대응하는 값을 반환한다. `fontSizeLabelState` selector는 쓸 수 없기 때문에(not writable) `useRecoilState`를 이용하지 않는다.
- [selector API reference](https://recoiljs.org/ko/docs/api-reference/core/selector/)

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeLabel = useRecoilValue(fontSizeLabelState);

  return (
    <>
      <div>Current font size: ${fontSizeLabel}</div>

      <button onClick={setFontSize(fontSize + 1)} style={{fontSize}}>
        Click to Enlarge
      </button>
    </>
  );
}
```

버튼를 클릭하면 버튼의 글꼴 크기가 증가하는 동시에 현재 글꼴 크기를 반영하도록 글꼴 크기 레이블을 업데이트하는 두 가지 작업이 수행된다.

## Installation

### ESLint

`useRecoilCallback`을 `additionalHooks` 목록에 추가하는 것이 좋다. 이를 추가하면 ESLint는 해당 훅을 사용하기 위해 전달된 종속성이 잘못 지정되었을 때 경고를 표시하고 해결 방안을 제시해준다. `additionalHooks`의 형식은 정규식 문자열이다.

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        "additionalHooks": "useRecoilCallback"
      }
    ]
  }
}
```

## Getting Started

### RecoilRoot

recoil 상태를 사용하는 컴포넌트는 부모 트리 어딘 가에 `RecoilRoot`가 필요하다. 루트 컴포넌트가 가장 좋은 위치다.

```js
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}
```

### Atom

`Atom`은 상태의 일부를 나타낸다. atom들은 어떤 컴포넌트에서나 읽고 쓸 수 있다. atom의 값을 읽는 컴포넌트들은 암묵적으로 atom을 구독(subscribe)한다. 그래서 atom에 변화가 생기면 그 atom을 구독하는 모든 컴포넌트들은 재렌더링된다.

```js
const textState = atom({
  key: 'textState', // unique ID (다른 atoms/selectors에 대하여)
  default: '', // default value (초기값)
});
```

컴포넌트에서 atom을 읽고 쓰려면 `useRecoilState()`를 사용하면 된다.

```js
function CharacterCounter() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

function TextInput() {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
}
```

### Selector

`Selector`는 파생된 상태(derived state)의 일부를 나타낸다. 파생된 상태는 상태의 변화다. 파생된 상태는 어떤 방법으로든 주어진 상태를 수정하는 순수 함수에 전달된 상태의 결과물로 생각하면 된다.

```js
const charCountState = selector({
  key: 'charCountState', // unique ID (다른 atoms/selectors에 대하여)
  get: ({get}) => {
    const text = get(textState);

    return text.length;
  },
});
```

`useRecoilValue` 훅을 사용해 `charCountState` 값을 읽을 수 있다.

```js
function CharacterCount() {
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
}
```

## Asynchronous Data Queries

### Synchronous Example

```js
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 1,
});

const currentUserNameState = selector({
  key: 'CurrentUserName',
  get: ({get}) => {
    return tableOfUsers[get(currentUserIDState)].name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameState);
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <CurrentUserInfo />
    </RecoilRoot>
  );
}
```

### Asynchronous Example

user의 이름을 쿼리해야 한다면 `Promise`를 리턴하거나 `async` 함수를 사용하면 된다. 의존성에 하나라도 변경점이 생긴다면 selector는 새로운 쿼리를 재평가하고 재실행시킨다. 결과는 쿼리가 유니크한 인풋이 있을 때만 실행되도록 캐시된다.

```js
const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({get}) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}
```

비동기로 바뀌더라도 selector의 인터페이스는 동일하므로 컴포넌트에서는 selector를 사용하면서 동기 atom 상태, 파생된 selector 상태, 비동기 쿼리를 지원하는지 신경쓰지 않아도 된다.

다만 React 렌더 함수가 동기이므로 promise가 resolve 되기 전에, 즉 보류중인 데이터를 다루기 위해 React Suspense와 함께 동작하도록 디자인되어 있다. 컴포넌트를 Suspense로 감싸 아직 보류중인 하위 항목들을 잡아내고 대체하기 위한 UI를 렌더한다.

```js
function MyApp() {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <CurrentUserInfo />
      </React.Suspense>
    </RecoilRoot>
  );
}
```

### Error Handling

selector는 컴포넌트에서 특정 값을 사용하려고 할 때 어떤 에러가 생길지에 대한 에러를 던질 수 있다. 
React `ErrorBoundary`로 잡을 수 있다.

```js
const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({get}) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <CurrentUserInfo />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```

### Queries with Parameters

파생된 상태만이 아닌 매개변수를 기반으로 쿼리하고 싶다면 `selectorFamily`를 사용할 수 있다.

```js
const userNameQuery = selectorFamily({
  key: 'UserName',
  get: (userID) => async () => {
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function UserInfo({userID}) {
  const userName = useRecoilValue(userNameQuery(userID));
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <UserInfo userID={1} />
          <UserInfo userID={2} />
          <UserInfo userID={3} />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```

### Data-Flow Graph

쿼리를 selector로 모델링하면 상태와 파생된 상태, 그리고 쿼리를 혼합한 데이터 플로우 그래프를 만들 수 있다. 이 그래프는 상태가 업데이트 되면 리액트 컴포넌트를 업데이트하고 리렌더링한다.

아래 예시는 최근 유저의 이름과 그들의 친구 리스트를 렌더링한다. 친구의 이름이 클릭되면 그 이름이 최근 유저가 되며 이름과 리스트는 자동적으로 업데이트 된다.

```js
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: null,
});

const userInfoQuery = selectorFamily({
  key: 'UserInfoQuery',
  get: (userID) => async () => {
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const currentUserInfoQuery = selector({
  key: 'CurrentUserInfoQuery',
  get: ({get}) => get(userInfoQuery(get(currentUserIDState))),
});

const friendsInfoQuery = selector({
  key: 'FriendsInfoQuery',
  get: ({get}) => {
    const {friendList} = get(currentUserInfoQuery);
    return friendList.map((friendID) => get(userInfoQuery(friendID)));
  },
});

function CurrentUserInfo() {
  const currentUser = useRecoilValue(currentUserInfoQuery);
  const friends = useRecoilValue(friendsInfoQuery);
  const setCurrentUserID = useSetRecoilState(currentUserIDState);
  return (
    <div>
      <h1>{currentUser.name}</h1>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => setCurrentUserID(friend.id)}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <CurrentUserInfo />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```

### Concurrent Requests

TODO:

### Pre-Fetching

TODO:

### Query Default Atom Values

TODO:

### Async Queries Without React Suspense

보류중인 비동기 selector를 다루기 위해서 React Suspense 대신 `useRecoilValueLoadable` 훅을 사용하여 렌더링 중 상태(status)를 확인할 수도 있다.

```js
function UserInfo({userID}) {
  const userNameLoadable = useRecoilValueLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case 'hasValue':
      return <div>{userNameLoadable.contents}</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'hasError':
      throw userNameLoadable.contents;
  }
}
```

### Query Refresh

TODO: 
