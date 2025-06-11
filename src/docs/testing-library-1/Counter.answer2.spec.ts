import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";

import Counter from "../../components/Counter.vue";

// 【練習用テストケース】キーボードインタラクションのテスト
describe("練習：キーボード操作でのボタン操作", () => {
  test("Tabキーでボタン間を移動できる", async () => {
    const user = userEvent.setup();

    // コンポーネントをレンダリング
    render(Counter, { props: { initialCount: 1 } });

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // 初期状態確認（Count: 1、減らすボタンが有効）
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
    expect(decrementButton).toBeEnabled();

    // 最初のボタンにフォーカスを設定
    incrementButton.focus();
    expect(incrementButton).toHaveFocus();

    // user.tab()を使用してタブ移動をテスト
    await user.tab();
    expect(decrementButton).toHaveFocus();
  });

  test("Enterキーで増やすボタンを実行できる", async () => {
    const user = userEvent.setup();

    // コンポーネントをレンダリング
    render(Counter);

    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // 増やすボタンにフォーカスを当てる（マウスを使わずfocus()を使用）
    incrementButton.focus();
    expect(incrementButton).toHaveFocus();

    // Enterキーを押下
    await user.keyboard("{Enter}");

    // カウントが1増えることを検証
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  test("Spaceキーで減らすボタンを実行できる", async () => {
    const user = userEvent.setup();

    // コンポーネントをレンダリング（初期値1で開始）
    render(Counter, { props: { initialCount: 1 } });

    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // 初期状態確認（Count: 1になっている）
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
    expect(decrementButton).toBeEnabled();

    // 減らすボタンにフォーカスを当てる
    decrementButton.focus();
    expect(decrementButton).toHaveFocus();

    // Spaceキーを押下（シンプルな記法を使用）
    await user.keyboard(" ");

    // カウントが0になることを検証
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  test("キーボードとマウス操作を組み合わせる", async () => {
    const user = userEvent.setup();

    // コンポーネントをレンダリング
    render(Counter);

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // キーボード操作：増やすボタンにフォーカスを当ててEnterキーで実行
    incrementButton.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
    expect(decrementButton).toBeEnabled();

    // マウス操作：減らすボタンをクリック
    await user.click(decrementButton);

    // カウントが0になることを検証
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});
