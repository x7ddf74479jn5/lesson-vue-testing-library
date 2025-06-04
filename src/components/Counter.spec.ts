import { shallowMount } from '@vue/test-utils';
import { render, screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';

import Counter from './Counter.vue';

describe('増やすボタンをクリックするとカウントが増加する', () => {
  test('@vue/test-utils を使用', async () => {
    const wrapper = shallowMount(Counter);
    await wrapper.find('button:not([disabled])').trigger('click');
    expect(wrapper.find('p').text()).toBe('Count: 1');
  });

  test('減らすボタンをクリックするとカウントが減少する', async () => {
    const wrapper = shallowMount(Counter, {
      props: { initialCount: 1 },
    });
    await wrapper.vm.$nextTick();
    const buttons = wrapper.findAll('button');
    const decrementButton = buttons.at(1)!;
    await decrementButton.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('p').text()).toBe('Count: 0');
  });

  test('カウントが0の場合、減らすボタンは無効化される', async () => {
    const wrapper = shallowMount(Counter, {
      props: { initialCount: 0 },
    });
    await wrapper.vm.$nextTick();
    const decrementButton = wrapper.findAll('button').at(1);
    expect(decrementButton!.attributes('disabled')).toBeDefined();
  });
});

describe('Counter.vue (@testing-library/vue を使用)', () => {
  const user = userEvent.setup();
  test('増やすボタンをクリックするとカウントが増加する', async () => {
    render(Counter);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    await user.click(incrementButton);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('減らすボタンをクリックするとカウントが減少する', async () => {
    render(Counter);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    await user.click(incrementButton);
    await user.click(decrementButton);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('カウントが0の場合、減らすボタンは無効化される', () => {
    render(Counter);
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    expect(decrementButton).toBeDisabled();
  });
});
