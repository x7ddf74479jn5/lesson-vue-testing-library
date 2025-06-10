import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";

// テスト対象のCounterコンポーネントをインポート
import Counter from "../../components/Counter.vue";

// 【練習用テストケース】複数回連続クリックのテスト
describe("練習：複数回ボタンをクリックした場合の動作", () => {
  test("増やすボタンを3回クリックするとカウントが3になる", async () => {
    // userEvent.setup()：ユーザー操作のセットアップ
    const user = userEvent.setup();

    // コンポーネントをレンダリング
    render(Counter);

    // 増やすボタンを取得
    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // 3回連続でクリック
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    // カウントが3になっていることを検証
    expect(screen.getByText("Count: 3")).toBeInTheDocument();
  });

  test("増やすボタン5回→減らすボタン2回で最終的に3になる", async () => {
    const user = userEvent.setup();
    render(Counter);

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // 5回増やす
    for (let i = 0; i < 5; i++) {
      await user.click(incrementButton);
    }

    // 2回減らす
    await user.click(decrementButton);
    await user.click(decrementButton);

    // 最終的に3になることを検証
    expect(screen.getByText("Count: 3")).toBeInTheDocument();
  });
});

// 【練習用テストケース】初期値のテスト
describe("練習：初期値が設定されている場合の動作", () => {
  test("初期値10で開始し、増やすボタンをクリックすると11になる", async () => {
    const user = userEvent.setup();

    // 初期値10でコンポーネントをレンダリング
    render(Counter, {
      props: { initialCount: 10 },
    });

    // 初期値が正しく表示されていることを確認
    expect(screen.getByText("Count: 10")).toBeInTheDocument();

    // 増やすボタンをクリック
    const incrementButton = screen.getByRole("button", { name: /increment/i });
    await user.click(incrementButton);

    // カウントが11になることを検証
    expect(screen.getByText("Count: 11")).toBeInTheDocument();
  });

  test("初期値5で開始し、減らすボタンを2回クリックすると3になる", async () => {
    const user = userEvent.setup();

    render(Counter, {
      props: { initialCount: 5 },
    });

    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // 2回減らす
    await user.click(decrementButton);
    await user.click(decrementButton);

    // カウントが3になることを検証
    expect(screen.getByText("Count: 3")).toBeInTheDocument();
  });
});

// 【練習用テストケース】カウンター表示形式のテスト
describe("練習：カウンターの表示内容をテストする", () => {
  test("カウンターの表示が正しい形式（Count: 数値）になっている", () => {
    render(Counter);

    // getByText()で正確なテキストパターンを検証
    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    // 正規表現を使ってパターンマッチング
    expect(screen.getByText(/^Count: \d+$/)).toBeInTheDocument();
  });

  test("複数の値でカウンター表示形式をテスト", async () => {
    const user = userEvent.setup();
    render(Counter);

    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // 各段階でテキスト形式を検証
    expect(screen.getByText(/^Count: 0$/)).toBeInTheDocument();

    await user.click(incrementButton);
    expect(screen.getByText(/^Count: 1$/)).toBeInTheDocument();

    await user.click(incrementButton);
    expect(screen.getByText(/^Count: 2$/)).toBeInTheDocument();
  });

  test("ボタンのテキストが正しく表示されている", () => {
    render(Counter);

    // ボタンのテキスト内容を検証
    expect(screen.getByRole("button", { name: "Increment" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decrement" })).toBeInTheDocument();

    // getByText()でも検証可能
    expect(screen.getByText("Increment")).toBeInTheDocument();
    expect(screen.getByText("Decrement")).toBeInTheDocument();
  });
});
