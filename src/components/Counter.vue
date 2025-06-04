<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button :disabled="count <= 0" @click="decrement">Decrement</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CounterComponent",
  props: {
    initialCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const count = ref(props.initialCount);

    const increment = () => {
      count.value++;
    };

    const decrement = () => {
      if (count.value > 0) {
        count.value--;
      }
    };

    return {
      count,
      increment,
      decrement,
    };
  },
});
</script>
