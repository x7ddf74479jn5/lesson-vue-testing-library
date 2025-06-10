// テストに必要なライブラリをインポート
import { userEvent } from "@testing-library/user-event"; // ユーザーの操作（クリック、入力など）をシミュレートするライブラリ
import { render, screen } from "@testing-library/vue"; // @testing-library/vueの主要機能
import { shallowMount } from "@vue/test-utils"; // Vue公式のテストユーティリティ

// テスト対象のCounterコンポーネントをインポート
import Counter from "./Counter.vue";

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
