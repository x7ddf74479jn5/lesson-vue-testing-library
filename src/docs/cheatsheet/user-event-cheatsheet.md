# @testing-library/user-event チートシート

`@testing-library/user-event`は、実際のユーザー操作をシミュレートするためのライブラリです。

## セットアップ

```typescript
import { userEvent } from "@testing-library/user-event";

// テスト内でセットアップ
const user = userEvent.setup();
```

## 基本的な操作

### クリック

#### `click()`

要素をクリック

```typescript
await user.click(screen.getByRole("button", { name: "Submit" }));
await user.click(screen.getByText("リンクテキスト"));
```

#### `dblClick()`

要素をダブルクリック

```typescript
await user.dblClick(screen.getByTestId("file-item"));
```

#### `tripleClick()`

要素をトリプルクリック（テキスト全選択など）

```typescript
await user.tripleClick(screen.getByTestId("text-content"));
```

### キーボード操作

#### `type()`

テキストを入力

```typescript
// 基本的な入力
await user.type(screen.getByLabelText("Name"), "John Doe");

// 特殊キーと組み合わせ
await user.type(screen.getByLabelText("Email"), "test@example.com{Enter}");

// 既存テキストをクリアしてから入力
await user.type(screen.getByLabelText("Search"), "new search{selectall}{backspace}updated");
```

#### `clear()`

入力フィールドをクリア

```typescript
await user.clear(screen.getByLabelText("Search"));
```

#### `keyboard()`

キーボード入力（より詳細な制御）

```typescript
// 特殊キーの入力
await user.keyboard("{Enter}");
await user.keyboard("{Tab}");
await user.keyboard("{Escape}");
await user.keyboard("{ArrowDown}");

// 修飾キーとの組み合わせ
await user.keyboard("{Control>}a{/Control}"); // Ctrl+A
await user.keyboard("{Shift>}{Tab}{/Shift}"); // Shift+Tab
```

### マウス操作

#### `hover()` / `unhover()`

要素にマウスを乗せる/離す

```typescript
await user.hover(screen.getByTestId("tooltip-trigger"));
expect(screen.getByText("ツールチップ")).toBeVisible();

await user.unhover(screen.getByTestId("tooltip-trigger"));
expect(screen.queryByText("ツールチップ")).not.toBeInTheDocument();
```

### フォーム操作

#### `selectOptions()`

セレクトボックスのオプションを選択

```typescript
// 単一選択
await user.selectOptions(screen.getByLabelText("Country"), "japan");
await user.selectOptions(screen.getByLabelText("Country"), ["japan"]); // 配列でも可

// 複数選択
await user.selectOptions(screen.getByLabelText("Languages"), ["japanese", "english"]);

// オプションテキストで選択
await user.selectOptions(screen.getByLabelText("Country"), screen.getByText("日本"));
```

#### `deselectOptions()`

セレクトボックスの選択を解除

```typescript
await user.deselectOptions(screen.getByLabelText("Languages"), "french");
```

### ファイル操作

#### `upload()`

ファイルをアップロード

```typescript
const file = new File(["hello"], "hello.png", { type: "image/png" });
const input = screen.getByLabelText("Upload file");

await user.upload(input, file);
expect(input.files[0]).toBe(file);
expect(input.files).toHaveLength(1);

// 複数ファイル
const files = [
  new File(["file1"], "file1.txt", { type: "text/plain" }),
  new File(["file2"], "file2.txt", { type: "text/plain" }),
];
await user.upload(input, files);
```

## 特殊キー一覧

### 基本的なキー

```typescript
"{Enter}"; // Enterキー
"{Tab}"; // Tabキー
"{Escape}"; // Escapeキー
"{Space}"; // スペースキー
"{Backspace}"; // Backspaceキー
"{Delete}"; // Deleteキー
```

### 矢印キー

```typescript
"{ArrowUp}"; // 上矢印
"{ArrowDown}"; // 下矢印
"{ArrowLeft}"; // 左矢印
"{ArrowRight}"; // 右矢印
```

### 修飾キー

```typescript
"{Control}"; // Ctrlキー
"{Alt}"; // Altキー
"{Shift}"; // Shiftキー
"{Meta}"; // Cmd (Mac) / Windowsキー
```

### 組み合わせ（開始と終了を明示）

```typescript
"{Control>}a{/Control}"; // Ctrl+A
"{Shift>}{Tab}{/Shift}"; // Shift+Tab
"{Alt>}{F4}{/Alt}"; // Alt+F4
```

## 使用例（Counterコンポーネント）

```typescript
test("ユーザー操作のシミュレーション", async () => {
  const user = userEvent.setup();
  render(Counter);

  // ボタンクリック
  const incrementButton = screen.getByRole("button", { name: "Increment" });
  await user.click(incrementButton);

  // 複数回クリック
  for (let i = 0; i < 3; i++) {
    await user.click(incrementButton);
  }
  expect(screen.getByText("Count: 4")).toBeInTheDocument();

  // キーボード操作（ボタンにフォーカスを当ててEnterで実行）
  incrementButton.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByText("Count: 5")).toBeInTheDocument();
});
```

## よくある使用パターン

### フォーム入力

```typescript
test('フォーム入力のテスト', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);

  // 各フィールドに入力
  await user.type(screen.getByLabelText('名前'), '山田太郎');
  await user.type(screen.getByLabelText('メール'), 'yamada@example.com');
  await user.selectOptions(screen.getByLabelText('性別'), '男性');

  // チェックボックス
  await user.click(screen.getByLabelText('ニュースレター購読'));

  // 送信
  await user.click(screen.getByRole('button', { name: '送信' }));
});
```

### 検索機能

```typescript
test('検索機能のテスト', async () => {
  const user = userEvent.setup();
  render(<SearchComponent />);

  const searchInput = screen.getByLabelText('検索');

  // 検索語を入力
  await user.type(searchInput, 'React');

  // Enterで検索実行
  await user.keyboard('{Enter}');

  // または検索ボタンクリック
  // await user.click(screen.getByRole('button', { name: '検索' }));
});
```

### ドロップダウンメニュー

```typescript
test('ドロップダウンメニューのテスト', async () => {
  const user = userEvent.setup();
  render(<DropdownMenu />);

  // メニューを開く
  await user.click(screen.getByRole('button', { name: 'メニュー' }));

  // メニュー項目をクリック
  await user.click(screen.getByText('設定'));

  // キーボードナビゲーション
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{Enter}');
});
```

## オプション設定

### `setup()`のオプション

```typescript
// デフォルト設定
const user = userEvent.setup();

// カスタム設定
const user = userEvent.setup({
  delay: 100, // 操作間の遅延（ms）
  skipHover: true, // hover操作をスキップ
  pointerEventsCheck: 0, // ポインターイベントのチェックを無効化
});
```

### `type()`のオプション

```typescript
// 遅延なしで高速入力
await user.type(input, "fast typing", { delay: null });

// 1文字ずつゆっくり入力
await user.type(input, "slow typing", { delay: 200 });

// 既存テキストをクリアしない
await user.type(input, "additional text", { skipClick: true });
```

## 参考リンク

- [公式ドキュメント](https://testing-library.com/docs/user-event/intro)
- [API リファレンス](https://testing-library.com/docs/user-event/api)
