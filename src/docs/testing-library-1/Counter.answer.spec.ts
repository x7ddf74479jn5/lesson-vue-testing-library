// テストに必要なライブラリをインポート
import { userEvent } from "@testing-library/user-event"; // ユーザーの操作（クリック、入力など）をシミュレートするライブラリ
import { render, screen } from "@testing-library/vue"; // @testing-library/vueの主要機能
import { shallowMount } from "@vue/test-utils"; // Vue公式のテストユーティリティ

// テスト対象のCounterコンポーネントをインポート
import Counter from "../../components/Counter.vue";

// describeブロック：関連するテストをグループ化する
// この場合は「増やすボタンの機能」に関するテストをまとめている
describe("増やすボタンをクリックするとカウントが増加する", () => {
  // @vue/test-utilsを使用したテストケース
  test("@vue/test-utils", async () => {
    // shallowMount：コンポーネントをマウント（レンダリング）する
    // 子コンポーネントは実際にレンダリングされず、スタブ（偽物）として扱われる
    const wrapper = shallowMount(Counter);

    // 無効化されていない（disabled属性がない）ボタンを探してクリックイベントを発火
    // CSSセレクタでボタンを特定し、trigger()でイベントを実行
    await wrapper.find("button:not([disabled])").trigger("click");

    // expect：テストの期待値を設定
    // p要素のテキストが"Count: 1"になっていることを検証
    expect(wrapper.find("p").text()).toBe("Count: 1");
  });

  // @testing-library/vueを使用したテストケース
  test("@testing-library/vue", async () => {
    // userEvent.setup()：ユーザーの操作をシミュレートするためのセットアップ
    const user = userEvent.setup();

    // render：コンポーネントをDOMにレンダリング
    // @testing-library/vueの方法でコンポーネントを描画
    render(Counter);

    // screen.getByRole：アクセシビリティロール（role属性）でボタンを取得
    // name: /increment/i は正規表現で"increment"という文字列を含むボタンを検索
    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // user.click()：実際のユーザーのクリック操作をシミュレート
    await user.click(incrementButton);

    // screen.getByText：指定されたテキストを含む要素を取得
    // toBeInTheDocument()：その要素がDOM内に存在することを検証
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});

// describeブロック：「減らすボタンの機能」に関するテストをグループ化
describe("減らすボタンをクリックするとカウントが減少する", () => {
  // @vue/test-utilsでの減少ボタンテスト
  test("@vue/test-utils", async () => {
    // propsでinitialCountを1に設定してコンポーネントをマウント
    // 初期値を設定することで、減少させるためのカウント値を用意
    const wrapper = shallowMount(Counter, {
      props: { initialCount: 1 },
    });

    // $nextTick()：Vueの次の更新サイクルまで待機
    // DOM更新が完了するまで待つために使用
    await wrapper.vm.$nextTick();

    // findAll()：指定されたセレクタに一致するすべての要素を取得
    // 複数のボタンから2番目（減らすボタン）を取得
    const buttons = wrapper.findAll("button");
    const decrementButton = buttons.at(1)!; // at(1)で2番目の要素、!で非nullをアサート

    // 減らすボタンをクリック
    await decrementButton.trigger("click");
    await wrapper.vm.$nextTick(); // 再度DOM更新を待機

    // カウントが0になったことを検証
    expect(wrapper.find("p").text()).toBe("Count: 0");
  });

  // @testing-library/vueでの減少ボタンテスト
  test("@testing-library/vue", async () => {
    const user = userEvent.setup();
    render(Counter);

    // 増やすボタンと減らすボタンを両方取得
    const incrementButton = screen.getByRole("button", { name: /increment/i });
    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // まず増やしてから減らす操作をテスト
    // 初期値0から1に増やし、その後0に戻すことで減少機能をテスト
    await user.click(incrementButton);
    await user.click(decrementButton);

    // カウントが0に戻ったことを検証
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});

// describeブロック：「ボタンの無効化機能」に関するテストをグループ化
describe("カウントが0の場合、減らすボタンは無効化される", () => {
  // @vue/test-utilsでのボタン無効化テスト
  test("@vue/test-utils", async () => {
    // 初期カウントを0に設定してコンポーネントをマウント
    const wrapper = shallowMount(Counter, {
      props: { initialCount: 0 },
    });

    // DOM更新完了を待機
    await wrapper.vm.$nextTick();

    // 2番目のボタン（減らすボタン）を取得
    const decrementButton = wrapper.findAll("button").at(1);

    // disabled属性が設定されていることを検証
    // toBeDefined()：属性が存在することを確認
    expect(decrementButton!.attributes("disabled")).toBeDefined();
  });

  // @testing-library/vueでのボタン無効化テスト
  test("@testing-library/vue", () => {
    // コンポーネントをレンダリング（初期カウントは0）
    render(Counter);

    // 減らすボタンを取得
    const decrementButton = screen.getByRole("button", { name: /decrement/i });

    // toBeDisabled()：ボタンが無効化されていることを検証
    // @testing-library独自のマッチャーで、disabled属性の確認より直感的
    expect(decrementButton).toBeDisabled();
  });
});

// これ以降は練習用です。@testing-library/vueを使ってテストを書いていきます。

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
