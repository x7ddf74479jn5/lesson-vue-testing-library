# @testing-library/jest-dom チートシート

`@testing-library/jest-dom`は、DOM要素をテストするためのカスタムマッチャーを提供するライブラリです。

## 主要なマッチャー

### 要素の存在・可視性

#### `toBeInTheDocument()`

要素がDOM内に存在するかを確認

```typescript
expect(screen.getByText("Hello")).toBeInTheDocument();
expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
```

#### `toBeVisible()`

要素が画面上で見える状態かを確認（`display: none`や`visibility: hidden`でない）

```typescript
expect(screen.getByTestId("modal")).toBeVisible();
expect(screen.getByTestId("hidden-element")).not.toBeVisible();
```

#### `toBeEmptyDOMElement()`

要素が空（子要素やテキストがない）かを確認

```typescript
expect(screen.getByTestId("empty-div")).toBeEmptyDOMElement();
expect(screen.getByTestId("content-div")).not.toBeEmptyDOMElement();
```

### フォーム要素

#### `toBeDisabled()` / `toBeEnabled()`

要素が無効化/有効化されているかを確認

```typescript
expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
```

#### `toBeRequired()`

フォーム要素が必須入力かを確認

```typescript
expect(screen.getByLabelText("Email")).toBeRequired();
expect(screen.getByLabelText("Phone")).not.toBeRequired();
```

#### `toBeInvalid()` / `toBeValid()`

フォーム要素のバリデーション状態を確認

```typescript
expect(screen.getByLabelText("Email")).toBeInvalid();
expect(screen.getByLabelText("Name")).toBeValid();
```

#### `toHaveValue()`

入力要素の値を確認

```typescript
expect(screen.getByLabelText("Username")).toHaveValue("john");
expect(screen.getByLabelText("Age")).toHaveValue(25);
expect(screen.getByLabelText("Country")).toHaveValue("Japan");
```

#### `toHaveDisplayValue()`

表示されている値を確認（select要素のオプションテキストなど）

```typescript
expect(screen.getByDisplayValue("日本")).toBeInTheDocument();
```

#### `toBeChecked()` / `toBePartiallyChecked()`

チェックボックス・ラジオボタンの状態を確認

```typescript
expect(screen.getByLabelText("利用規約に同意する")).toBeChecked();
expect(screen.getByLabelText("ニュースレター購読")).not.toBeChecked();
expect(screen.getByLabelText("すべて選択")).toBePartiallyChecked(); // 一部のみ選択状態
```

### テキスト・属性

#### `toHaveTextContent()`

要素のテキスト内容を確認（子要素のテキストも含む）

```typescript
expect(screen.getByTestId("welcome-message")).toHaveTextContent("こんにちは、田中さん");
expect(screen.getByTestId("status")).toHaveTextContent(/処理中|完了/); // 正規表現も使用可能
```

#### `toHaveAttribute()`

要素の属性を確認

```typescript
expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
expect(screen.getByTestId("image")).toHaveAttribute("alt");
expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
```

#### `toHaveClass()`

要素のCSSクラスを確認

```typescript
expect(screen.getByTestId("alert")).toHaveClass("alert-success");
expect(screen.getByTestId("button")).toHaveClass("btn", "btn-primary"); // 複数クラス
expect(screen.getByTestId("card")).not.toHaveClass("hidden");
```

#### `toHaveStyle()`

要素のスタイルを確認

```typescript
expect(screen.getByTestId("modal")).toHaveStyle("display: block");
expect(screen.getByTestId("error")).toHaveStyle({
  color: "red",
  fontWeight: "bold",
});
```

### フォーカス

#### `toHaveFocus()`

要素にフォーカスが当たっているかを確認

```typescript
expect(screen.getByLabelText("メールアドレス")).toHaveFocus();
```

### アクセシビリティ

#### `toHaveAccessibleName()`

要素のアクセシブル名を確認

```typescript
expect(screen.getByRole("button")).toHaveAccessibleName("送信する");
```

#### `toHaveAccessibleDescription()`

要素のアクセシブル説明を確認

```typescript
expect(screen.getByLabelText("パスワード")).toHaveAccessibleDescription("8文字以上で入力してください");
```

## 使用例（Counterコンポーネント）

```typescript
test("カウンターの基本的な動作とスタイル", async () => {
  const user = userEvent.setup();
  render(Counter);

  // 初期状態の確認
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
  expect(screen.getByText("Count: 0")).toHaveTextContent("Count: 0");

  // ボタンの状態確認
  const incrementButton = screen.getByRole("button", { name: "Increment" });
  const decrementButton = screen.getByRole("button", { name: "Decrement" });

  expect(incrementButton).toBeEnabled();
  expect(decrementButton).toBeDisabled(); // 初期値0なので無効化

  // ボタンクリック後の確認
  await user.click(incrementButton);
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
  expect(decrementButton).toBeEnabled(); // 1以上なので有効化
});
```

## よく使われる組み合わせ

```typescript
// 要素の存在と可視性を同時に確認
expect(screen.getByTestId("modal")).toBeInTheDocument();
expect(screen.getByTestId("modal")).toBeVisible();

// フォームの状態確認
const emailInput = screen.getByLabelText("Email");
expect(emailInput).toBeRequired();
expect(emailInput).toBeValid();
expect(emailInput).toHaveValue("user@example.com");

// ボタンの状態とテキスト確認
const submitButton = screen.getByRole("button", { name: /submit/i });
expect(submitButton).toBeEnabled();
expect(submitButton).toHaveTextContent("送信する");
expect(submitButton).toHaveAttribute("type", "submit");
```

## 参考リンク

- [公式ドキュメント](https://github.com/testing-library/jest-dom)
- [全マッチャー一覧](https://github.com/testing-library/jest-dom#custom-matchers)
