# @testing-library/vue チートシート

`@testing-library/vue`は、Vueコンポーネントをテストするためのシンプルで効率的なユーティリティを提供します。

## セットアップ

```typescript
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MyComponent from "./MyComponent.vue";
```

## レンダリング

### `render()`

コンポーネントをDOMにレンダリング

#### 基本的な使用法

```typescript
// シンプルなレンダリング
render(Counter);

// propsを渡してレンダリング
render(Counter, {
  props: {
    initialCount: 10,
    disabled: false,
  },
});
```

#### オプション付きレンダリング

```typescript
// 完全なオプション例
const renderResult = render(UserProfile, {
  props: {
    user: { name: "John", age: 30 },
  },
  slots: {
    default: "<p>デフォルトスロット</p>",
    header: "<h1>ヘッダースロット</h1>",
  },
  global: {
    plugins: [router, store],
    stubs: {},
    components: {
      "custom-component": CustomComponent,
    },
    provide: {
      theme: "dark",
    },
  },
});
```

### レンダリング結果

#### 戻り値の活用

```typescript
const { container, rerender, unmount } = render(Counter);

// container: レンダリングされたDOM要素
console.log(container.innerHTML);

// rerender: propsを変更して再レンダリング
await rerender({ props: { initialCount: 5 } });

// unmount: コンポーネントをアンマウント
unmount();
```

## クエリメソッド（要素の取得）

### `screen`オブジェクト

すべてのクエリメソッドが利用可能

#### ByRole（推奨）

アクセシビリティロールで要素を取得

```typescript
// ボタンを取得
screen.getByRole("button");
screen.getByRole("button", { name: "Submit" });
screen.getByRole("button", { name: /submit/i }); // 大文字小文字無視

// その他のロール
screen.getByRole("heading", { level: 1 }); // h1要素
screen.getByRole("textbox"); // input[type="text"]
screen.getByRole("checkbox");
screen.getByRole("link");
screen.getByRole("list");
screen.getByRole("listitem");
```

#### ByText

テキスト内容で要素を取得

```typescript
screen.getByText("Hello World");
screen.getByText(/hello/i); // 正規表現
screen.getByText("Hello", { exact: false }); // 部分マッチ

// 複数の要素から選択
screen.getAllByText(/item/i);
```

#### ByLabelText

ラベルに関連付けられたフォーム要素を取得

```typescript
screen.getByLabelText("Username");
screen.getByLabelText(/email/i);
screen.getByLabelText("Password", { exact: false });
```

#### ByPlaceholderText

プレースホルダーテキストで要素を取得

```typescript
screen.getByPlaceholderText("Enter your name");
screen.getByPlaceholderText(/search/i);
```

#### ByTestId

data-testid属性で要素を取得

```typescript
screen.getByTestId("submit-button");
screen.getByTestId("user-profile");
```

#### ByDisplayValue

表示されている値で要素を取得

```typescript
screen.getByDisplayValue("Current Value");
screen.getByDisplayValue(/selected/i);
```

#### ByAltText

alt属性で画像を取得

```typescript
screen.getByAltText("Profile picture");
screen.getByAltText(/avatar/i);
```

#### ByTitle

title属性で要素を取得

```typescript
screen.getByTitle("Close dialog");
screen.getByTitle(/tooltip/i);
```

### クエリの種類

#### `getBy*` vs `queryBy*` vs `findBy*`

```typescript
// getBy*: 要素が存在することを前提（見つからないとエラー）
const button = screen.getByRole("button");

// queryBy*: 要素が存在しない可能性がある（見つからないとnull）
const optionalElement = screen.queryByText("Optional Text");
expect(optionalElement).toBeNull();

// findBy*: 非同期で要素を待機（Promiseを返す）
const asyncElement = await screen.findByText("Loaded Content");

// 複数要素を取得
const buttons = screen.getAllByRole("button");
const optionalButtons = screen.queryAllByRole("button");
const asyncButtons = await screen.findAllByRole("button");
```

## Vueコンポーネント特有の機能

### props の変更

```typescript
test("propsの変更をテスト", async () => {
  const { rerender } = render(Counter, {
    props: { initialCount: 0 },
  });

  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  // propsを変更して再レンダリング
  await rerender({ props: { initialCount: 10 } });
  expect(screen.getByText("Count: 10")).toBeInTheDocument();
});
```

### slots の使用

```typescript
test("スロットのテスト", () => {
  render(Card, {
    slots: {
      default: "<p>カードの内容</p>",
      header: "<h2>カードタイトル</h2>",
      footer: "<button>アクション</button>",
    },
  });

  expect(screen.getByText("カードの内容")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "カードタイトル" })).toBeInTheDocument();
});
```

### グローバル設定

```typescript
// プラグインの設定
render(MyComponent, {
  global: {
    plugins: [createRouter({ history: createMemoryHistory(), routes: [] }), createPinia()],
  },
});

// グローバルコンポーネントの登録
render(MyComponent, {
  global: {
    components: {
      "router-link": RouterLinkStub,
      "global-component": GlobalComponent,
    },
  },
});

// provide/inject の設定
render(MyComponent, {
  global: {
    provide: {
      "api-client": mockApiClient,
      theme: "dark",
    },
  },
});
```

## 実践的な使用例

### 基本的なコンポーネントテスト

```typescript
test("Counterコンポーネントの基本機能", async () => {
  const user = userEvent.setup();
  render(Counter);

  // 初期状態の確認
  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  // ボタンの取得と操作
  const incrementButton = screen.getByRole("button", { name: "Increment" });
  await user.click(incrementButton);

  // 状態変更の確認
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### フォームコンポーネントのテスト

```typescript
test("フォームの送信テスト", async () => {
  const user = userEvent.setup();
  const mockSubmit = vi.fn();

  render(ContactForm, {
    props: { onSubmit: mockSubmit },
  });

  // フォーム入力
  await user.type(screen.getByLabelText("名前"), "山田太郎");
  await user.type(screen.getByLabelText("メールアドレス"), "yamada@example.com");
  await user.selectOptions(screen.getByLabelText("お問い合わせ種別"), "質問");

  // 送信
  await user.click(screen.getByRole("button", { name: "送信" }));

  // 呼び出し確認
  expect(mockSubmit).toHaveBeenCalledWith({
    name: "山田太郎",
    email: "yamada@example.com",
    type: "質問",
  });
});
```

### リストコンポーネントのテスト

```typescript
test("TodoListの表示と操作", async () => {
  const user = userEvent.setup();
  const todos = [
    { id: 1, text: "タスク1", completed: false },
    { id: 2, text: "タスク2", completed: true },
  ];

  render(TodoList, {
    props: { todos },
  });

  // リスト項目の確認
  expect(screen.getByText("タスク1")).toBeInTheDocument();
  expect(screen.getByText("タスク2")).toBeInTheDocument();

  // 完了状態の確認
  const task1Checkbox = screen.getByRole("checkbox", { name: "タスク1" });
  const task2Checkbox = screen.getByRole("checkbox", { name: "タスク2" });

  expect(task1Checkbox).not.toBeChecked();
  expect(task2Checkbox).toBeChecked();

  // チェックボックスの操作
  await user.click(task1Checkbox);
  expect(task1Checkbox).toBeChecked();
});
```

### 非同期操作のテスト

```typescript
test("非同期データ読み込みのテスト", async () => {
  // モックAPI
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: "John Doe", email: "john@example.com" }),
  });
  global.fetch = mockFetch;

  render(UserProfile, {
    props: { userId: 123 },
  });

  // ローディング状態の確認
  expect(screen.getByText("読み込み中...")).toBeInTheDocument();

  // データ読み込み完了を待機
  await screen.findByText("John Doe");
  expect(screen.getByText("john@example.com")).toBeInTheDocument();

  // ローディングが消えたことを確認
  expect(screen.queryByText("読み込み中...")).not.toBeInTheDocument();
});
```

### エラー状態のテスト

```typescript
test("エラー状態の表示", async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error("Network Error"));
  global.fetch = mockFetch;

  render(UserProfile, {
    props: { userId: 123 },
  });

  // エラーメッセージの表示を待機
  await screen.findByText(/エラーが発生しました/);
  expect(screen.getByText("Network Error")).toBeInTheDocument();
});
```

## デバッグ

### `screen.debug()`

現在のDOM状態を出力

```typescript
test("デバッグ例", () => {
  render(Counter);

  // DOM全体を出力
  screen.debug();

  // 特定の要素のみ出力
  screen.debug(screen.getByRole("button"));
});
```

### `logRoles()`

利用可能なロールを表示

```typescript
import { logRoles } from "@testing-library/dom";

test("ロール確認", () => {
  const { container } = render(MyComponent);
  logRoles(container);
});
```

## 設定とカスタマイズ

### カスタムレンダー関数

```typescript
// test-utils.ts
import { render as rtlRender } from "@testing-library/vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia } from "pinia";

export function render(component, options = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
  });

  return rtlRender(component, {
    global: {
      plugins: [router, createPinia()],
      ...options.global,
    },
    ...options,
  });
}
```

## 参考リンク

- [公式ドキュメント](https://testing-library.com/docs/vue-testing-library/intro)
- [Vue Testing Library API](https://testing-library.com/docs/vue-testing-library/api)
- [クエリの優先順位](https://testing-library.com/docs/queries/about#priority)
